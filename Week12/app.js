import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "https://bscit.sit.kmutt.ac.th/intproj25/ft/keycloak/",
  realm: "itb-ecors",
  clientId: "itb-ecors-cs1",
});

async function main() {
  try {

    const authenticated = await keycloak.init({ onLoad: "login-required" });

    if (!authenticated) {
      window.location.href = "/intproj25/cs1/itb-ecors/";
      return;
    }


    stdId = keycloak.tokenParsed.preferred_username;
    setupLogoutButton(keycloak);
    } catch(err) {
        console.error("App failed to start:", error);
    }
}

main()

const topMenuDom = document.querySelector(".top-menu");

function setupLogoutButton(kc) {
  const buttonElement = document.createElement("button");
  buttonElement.classList = "ecors-button-signout";
  buttonElement.textContent = "Sign Out";
  if (topMenuDom) topMenuDom.appendChild(buttonElement);

  buttonElement.addEventListener("click", () => {
    kc.logout({
      redirectUri: window.location.origin + "/intproj25/cs1/itb-ecors/",
    });
  });
}