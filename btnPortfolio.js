/*
POPOUT Button component to link back to Kiu's portfolio
has the css, js, and html component
THis component enable a hovering action for the banner 'Return to Kiu's resume page'

Here is a copy of the html
		<aside>
			<a
				href="https://zkiu.github.io/kiu-resume-portfolio/"
				aria-describedby="return to resume"
				tabindex="90"
				class="return-pop-out"
				><i class="far fa-caret-square-left"></i>
				<div id="return">Return to Kiu's resume page</div>
			</a>
		</aside>
*/

// export const btnPortfolio = () => {
setTimeout(() => {
	let element = document.querySelector('.return-pop-out')
	element.addEventListener('mouseenter', (e) => {
		e.target.style.cssText =
			'-webkit-transform: translate(-205px, 0px);	transform: translate(-205px, 0px);'
	})
	element.addEventListener('mouseleave', (e) => {
		e.target.style.cssText =
			'-webkit-transform: translate(0px, 0px);	transform: translate(0px, 0px);'
	})
}, 5000)
// }

// btnPortfolio()
