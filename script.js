const carousal = document.getElementById("carousal");
let slides = [];
let currSlide = 0;

(async function () {
	try {
		await populateData();

		slides.forEach((slide, index) => {
			slide.onclick = () => {
				if (currSlide === index) return;

				carousal.scrollTo({
					left: slides[index].offsetLeft + slides[index].clientWidth / 2 - carousal.clientWidth / 2,
					behavior: "smooth",
				});
			};
		});

		currSlide = Math.floor(slides.length / 2);
		carousal.scrollTo({
			left: slides[currSlide].offsetLeft + slides[currSlide].clientWidth / 2 - carousal.clientWidth / 2,
		});
	} catch (error) {
		console.error(error);
	}
})();

carousal.addEventListener("scroll", () => {
	let minDistance = Infinity;
	let minSlide = -1;

	// determine slides scale value which always lies between 0.5 to 1 based on the distance from the center
	slides.forEach((slide, index) => {
		const distance = Math.abs(
			carousal.scrollLeft + carousal.clientWidth / 2 - slide.offsetLeft - slide.clientWidth / 2
		);
		const scale = Math.max(0.5, 1 - distance / 500);
		slide.style.scale = `${scale}`;

		if (distance < minDistance) {
			minDistance = distance;
			minSlide = index;
		}
	});

	if (currSlide !== minSlide) {
		currSlide = minSlide;

		document.documentElement.style.setProperty(
			"--carousal-before-background-color",
			slides[currSlide].dataset.color
		);

		document.documentElement.style.setProperty("--carousal-before-opacity", "1");

		setTimeout(() => {
			document.documentElement.style.setProperty(
				"--carousal-after-background-color",
				slides[currSlide].dataset.color
			);
			document.documentElement.style.setProperty("--carousal-before-opacity", "0");
		}, 500);
	}
});

async function populateData() {
	const coffeeTypes = await fetch("./coffee.json").then((res) => res.json());

	coffeeTypes.forEach((coffee) => {
		const slide = document.createElement("div");

		slide.className = "slide";
		slide.id = "slide";
		slide.setAttribute("data-color", coffee.color);

		slide.innerHTML = `
					<div class="img" style="background-image: url(./${coffee.image})"></div>
					<h2>${coffee.name}</h2>
					<p>&#8377;${coffee.price / 100}</p>
				`;

		carousal.appendChild(slide);
		slides.push(slide);
	});

	// Space Filler
	const spaceFiller = document.createElement("div");
	carousal.appendChild(spaceFiller);
}

function placeOrder() {
	alert(
		`Order Placed: ${slides[currSlide].querySelector("h2").textContent} - ${
			slides[currSlide].querySelector("p").textContent
		}`
	);
}
