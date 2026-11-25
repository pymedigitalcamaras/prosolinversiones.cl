#!/usr/bin/env python3
"""Pruebas F3-A en Chromium. Requiere servidor local con el modo demo habilitado."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

BASE = "http://localhost:3000"
OUT = Path("/mnt/agents/output/evidencia-f3a")
OUT.mkdir(parents=True, exist_ok=True)
PASSWORD = "F3A-local-demo"
ROLES = {
    "empresa": {"label": "EMPRESA", "home": "/panel/empresa", "h1": "Base de operación y control."},
    "administrador": {"label": "Administrador", "home": "/panel/administrador", "h1": "Antecedentes de sus edificios autorizados."},
    "asesor": {"label": "Asesor", "home": "/panel/asesor", "h1": "Solo sus clientes y comisiones legítimas."},
}
R = {"capturas": [], "publico": {}, "accesos": {}, "seguridad": {}, "responsive": {}, "errores_consola": []}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path="/usr/bin/chromium", args=["--no-sandbox"])

    anonymous = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
    page = anonymous.new_page()
    errors = []
    page.on("console", lambda message: errors.append(f"{message.type}: {message.text}") if message.type == "error" else None)
    page.on("pageerror", lambda error: errors.append(f"pageerror: {error}"))

    for path in ["/", "/acceso", "/sitemap.xml", "/robots.txt"]:
        response = anonymous.request.get(BASE + path)
        R["publico"][path] = response.status
    sitemap = anonymous.request.get(BASE + "/sitemap.xml").text()
    robots = anonymous.request.get(BASE + "/robots.txt").text().lower()
    R["publico"]["paneles_fuera_sitemap"] = "/panel" not in sitemap and "/acceso" not in sitemap
    R["publico"]["panel_bloqueado_robots"] = "disallow: /panel/" in robots
    response = anonymous.request.get(BASE + "/panel/empresa", max_redirects=0)
    R["seguridad"]["panel_sin_sesion_http"] = response.status
    R["seguridad"]["panel_sin_sesion_destino"] = response.headers.get("location", "")

    page.goto(BASE + "/acceso", wait_until="networkidle")
    R["publico"]["acceso_noindex"] = "noindex" in page.locator('meta[name="robots"]').get_attribute("content")
    R["publico"]["acceso_cache"] = page.request.get(BASE + "/acceso").headers.get("cache-control", "")
    page.screenshot(path=str(OUT / "acceso-escritorio.png"), full_page=True)
    R["capturas"].append("acceso-escritorio.png")

    # Credenciales incorrectas: error honesto y sin cookie.
    page.locator("#demo-password").fill("clave-incorrecta")
    page.get_by_role("button", name="Entrar al panel demo").click()
    page.get_by_text("El correo o la clave no coinciden", exact=False).wait_for()
    R["seguridad"]["credenciales_invalidas_visibles"] = True
    R["seguridad"]["cookie_no_creada_con_error"] = not any(c["name"] == "prosol_f3_demo" for c in anonymous.cookies())
    errors.clear()

    # CSRF/origen y límite de intentos, con identidad inválida separada.
    login_url = BASE + "/api/auth/demo-login"
    payload = {"email": "empresa@f3.example", "password": PASSWORD}
    no_origin = anonymous.request.post(login_url, data=payload)
    R["seguridad"]["login_sin_origin_http"] = no_origin.status
    wrong_origin = anonymous.request.post(login_url, data=payload, headers={"Origin": "https://origen-invalido.example"})
    R["seguridad"]["login_origen_invalido_http"] = wrong_origin.status
    rate_statuses = []
    for _ in range(6):
        response = anonymous.request.post(login_url, data={"email": "limite@f3.example", "password": "incorrecta"}, headers={"Origin": BASE})
        rate_statuses.append(response.status)
    R["seguridad"]["limite_intentos_http"] = rate_statuses

    # Formulario público F2: sigue sin persistencia ni éxito falso.
    contact = anonymous.request.post(BASE + "/api/contacto", data={
        "mode": "contacto", "name": "Prueba local F3-A", "email": "prueba.f3a@example.com",
        "phone": "+56 9 1234 5678", "profile": "asesor", "message": "Solicitud sintética para regresión del formulario público.",
        "consent": "accepted", "consentVersion": "f2-demo-2026-10", "website": ""
    })
    R["publico"]["formulario_publico_http"] = contact.status
    R["publico"]["formulario_publico_codigo"] = contact.json().get("code")
    anonymous.close()

    for role, config in ROLES.items():
        context = browser.new_context(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
        page = context.new_page()
        role_errors = []
        page.on("console", lambda message, bag=role_errors: bag.append(f"{message.type}: {message.text}") if message.type == "error" else None)
        page.on("pageerror", lambda error, bag=role_errors: bag.append(f"pageerror: {error}"))
        page.goto(BASE + "/acceso", wait_until="networkidle")
        page.get_by_role("button", name=config["label"], exact=True).click()
        page.locator("#demo-password").fill(PASSWORD)
        page.get_by_role("button", name="Entrar al panel demo").click()
        page.wait_for_url("**" + config["home"])
        page.wait_for_load_state("networkidle")
        assert page.locator("h1").inner_text() == config["h1"]

        own = page.request.get(BASE + config["home"])
        cookie = next(c for c in context.cookies() if c["name"] == "prosol_f3_demo")
        cross = {}
        for other_role, other in ROLES.items():
            if other_role != role:
                cross[other_role] = page.request.get(BASE + other["home"]).status
        R["accesos"][role] = {
            "propio_http": own.status,
            "cruzados_http": cross,
            "noindex": "noindex" in page.locator('meta[name="robots"]').get_attribute("content"),
            "cache_control": own.headers.get("cache-control", ""),
            "cookie_http_only": cookie["httpOnly"],
            "cookie_same_site": cookie["sameSite"],
            "cookie_secure_local": cookie["secure"],
            "h1": page.locator("h1").count(),
            "imagenes_sin_alt": page.locator("img:not([alt])").count(),
            "imagenes_rotas": page.locator("img").evaluate_all("imgs => imgs.filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src)"),
        }
        R["responsive"][role] = {
            "escritorio_desborde": page.evaluate("document.documentElement.scrollWidth > window.innerWidth"),
        }
        page.screenshot(path=str(OUT / f"panel-{role}-escritorio.png"), full_page=True)
        R["capturas"].append(f"panel-{role}-escritorio.png")
        page.set_viewport_size({"width": 390, "height": 844})
        R["responsive"][role]["movil_desborde"] = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
        page.screenshot(path=str(OUT / f"panel-{role}-movil.png"), full_page=True)
        R["capturas"].append(f"panel-{role}-movil.png")

        # Una cookie alterada no debe autorizar.
        altered = cookie["value"][:-1] + ("A" if cookie["value"][-1] != "A" else "B")
        context.clear_cookies()
        context.add_cookies([{**cookie, "value": altered}])
        tampered = context.request.get(BASE + config["home"], max_redirects=0)
        R["accesos"][role]["cookie_alterada_http"] = tampered.status
        R["accesos"][role]["cookie_alterada_destino"] = tampered.headers.get("location", "")
        context.close()
        R["errores_consola"].extend(role_errors)

    # Cierre de sesión en una sesión nueva y captura móvil del acceso.
    context = browser.new_context(viewport={"width": 390, "height": 844}, reduced_motion="reduce")
    page = context.new_page()
    page.goto(BASE + "/acceso", wait_until="networkidle")
    page.screenshot(path=str(OUT / "acceso-movil.png"), full_page=True)
    R["capturas"].append("acceso-movil.png")
    R["responsive"]["acceso_movil_desborde"] = page.evaluate("document.documentElement.scrollWidth > window.innerWidth")
    page.set_viewport_size({"width": 1440, "height": 1000})
    page.get_by_role("button", name="EMPRESA", exact=True).click()
    page.locator("#demo-password").fill(PASSWORD)
    page.get_by_role("button", name="Entrar al panel demo").click()
    page.wait_for_url("**/panel/empresa")
    page.get_by_role("button", name="Cerrar sesión demo").click()
    page.wait_for_url("**/acceso")
    after_logout = context.request.get(BASE + "/panel/empresa", max_redirects=0)
    R["seguridad"]["logout_http"] = after_logout.status
    R["seguridad"]["logout_destino"] = after_logout.headers.get("location", "")
    context.close()
    browser.close()

(OUT / "verificacion-navegador.json").write_text(json.dumps(R, ensure_ascii=False, indent=2))
print(json.dumps(R, ensure_ascii=False, indent=2))
