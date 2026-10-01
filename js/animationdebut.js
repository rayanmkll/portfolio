window.addEventListener("load", () => {

    // ============================
    // Vérifie si l'intro a déjà été vue
    // ============================
    const introDejaVue = sessionStorage.getItem("intro_vue");

    const wrapper = document.querySelector(".wrapper");
    const mf = document.querySelectorAll('.m-f')[0];

    if (introDejaVue) {
        // Skip animation → montre directement le contenu principal
        wrapper.style.display = "none";
        mf.style.display = "flex";
        mf.style.pointerEvents = "auto";
        document.body.style.overflow = "auto";
        return; // on arrête le script
    }

    // ============================
    // Récupération des éléments
    // ============================
    const holdZone = document.querySelector(".intro");
    const hero = document.querySelector(".section.hero");
    const image = document.querySelector(".image-container img");

    let isHolding = false;
    let isFinished = false;

    // ============================
    // Timeline GSAP pour l'animation
    // ============================
    const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power1.inOut" },
        onComplete: () => {
            isFinished = true;
            finishExperience();
        },
        onReverseComplete: () => {
            isFinished = false;
        }
    });

    // Zoom image
    tl.to(image, { scale: 2, z: 250, duration: 4 }, 0);
    // Zoom background
    tl.to(hero, { scale: 1.4, duration: 4 }, 0);
    // Assombrissement
    tl.to(hero, { "--darken": 1, duration: 4 }, 0);

    // ============================
    // Fonctions appui / relâche
    // ============================
    function startHold() {
        if (isFinished) return;
        isHolding = true;
        holdZone.classList.add("is-holding");
        tl.play();
    }

    function endHold() {
        if (!isHolding) return;
        isHolding = false;
        holdZone.classList.remove("is-holding");
        if (!isFinished) tl.reverse();
    }

    // ============================
    // Event listeners
    // ============================
    holdZone.addEventListener("pointerdown", startHold);
    document.addEventListener("pointerup", endHold);

    holdZone.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startHold();
    }, { passive: false });

    holdZone.addEventListener("touchend", endHold);

    // ============================
    // Fin de l'expérience → transition vers le contenu
    // ============================
    function finishExperience() {
        // Rendre le contenu principal visible
        mf.style.display = "flex";
        mf.style.pointerEvents = "auto";

        // Masquer l'intro
        gsap.to(wrapper, {
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                wrapper.style.display = "none";
                document.body.style.overflow = "auto";

                // 🔒 On note que l'animation a été vue
                sessionStorage.setItem("intro_vue", "true");
            }
        });
    }

});