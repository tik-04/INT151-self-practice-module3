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

export default setupLogoutButton