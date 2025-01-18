document.addEventListener("DOMContentLoaded", function() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../templates/navbar.css";
    document.head.appendChild(link);

    const navbar = document.createElement("div");
    navbar.id = "navbar";
    navbar.innerHTML = `
      <ul>
        <li><a href="../index.html">Home</a></li>
        <li><a href="../buckshot-roulette/index.html">Buckshot Roulette Tool</a></li>
        <li><a href="../wordle/index.html">Wordle Tool</a></li>
        <li><a href="../minecraft-trades/index.html">Minecraft Trading Guide</a></li>
      </ul>
    `;
  
    document.body.insertBefore(navbar, document.body.firstChild);
  });
  