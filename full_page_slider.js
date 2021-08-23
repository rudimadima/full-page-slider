!function() {
	const fullSizeBlocks = document.getElementsByClassName('fullSizeBlock');
	const sideLinksBlock = document.querySelector('.linksToSlides');
	let sideLinksBlockItems = document.querySelectorAll('.linksToSlides .item'); // querySelectorAll returns static (not live) collection

	// Костыль для мобильного Google Chrome, который некорректно задаёт вертикальный размер вьюпорта, плюсуя туда свою панель.
	// В мобильной хромоопере такой проблемы нет.
	const vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', (vh + 'px')); 
	window.addEventListener('resize', () => {
		const vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', (vh + 'px'));
	});

	function handleWheel(e) {
		const indexOfCurrentFullSizeBlock = getIndexOfCurrentFullSizeBlock();
		if (indexOfCurrentFullSizeBlock === null) { return; }

		e.preventDefault();
		
		if (e.deltaY > 0) {
			if (indexOfCurrentFullSizeBlock === fullSizeBlocks.length - 1) { return; }
			// console.log('going down');
			const nextIndex = indexOfCurrentFullSizeBlock + 1;
			scrollToFullSizeBlock(nextIndex);
			removeActiveClassFromAllLinks();
			addActiveClassToLink(nextIndex);
		}

		if (e.deltaY < 0) {
			if (indexOfCurrentFullSizeBlock === 0) { return; }
			// console.log('going up');
			const nextIndex = indexOfCurrentFullSizeBlock - 1;
			scrollToFullSizeBlock(nextIndex);
			removeActiveClassFromAllLinks();
			addActiveClassToLink(nextIndex);
		}
	}

	function handleKeydown(e) {
		const indexOfCurrentFullSizeBlock = getIndexOfCurrentFullSizeBlock();
		if (indexOfCurrentFullSizeBlock === null) { return; }

		if (e.key === 'Home') {
			if (isElemOrAncestorEditable(e.target)) { return; }
			// console.log('processing Home key press');
			removeActiveClassFromAllLinks();
			addActiveClassToLink(0);
		}

		if (e.key === 'End') {
			if (isElemOrAncestorEditable(e.target)) { return; }
			// console.log('processing End key press');
			removeActiveClassFromAllLinks();
			addActiveClassToLink(fullSizeBlocks.length - 1);
		}

		if (e.key === 'PageDown') {
			if (indexOfCurrentFullSizeBlock === fullSizeBlocks.length - 1) { return; }
			e.preventDefault();
			// console.log('going down');
			const nextIndex = indexOfCurrentFullSizeBlock + 1;
			scrollToFullSizeBlock(nextIndex);
			removeActiveClassFromAllLinks();
			addActiveClassToLink(nextIndex);
		}

		if (e.key === 'PageUp') {
			if (indexOfCurrentFullSizeBlock === 0) { return; }
			e.preventDefault();
			// console.log('going up');
			const nextIndex = indexOfCurrentFullSizeBlock - 1;
			scrollToFullSizeBlock(nextIndex);
			removeActiveClassFromAllLinks();
			addActiveClassToLink(nextIndex);
		}
	}

	function getIndexOfCurrentFullSizeBlock() {
		const elemInViewportCenter = document.elementFromPoint((window.innerWidth / 2), (window.innerHeight / 2));
		const currentFullSizeBlock = elemInViewportCenter.closest('.fullSizeBlock');
		for (let i = 0; i < fullSizeBlocks.length; i++) {
			if (fullSizeBlocks[i] === currentFullSizeBlock) {
				return i;
			}
		}
		return null;
	}

	function scrollToFullSizeBlock(index) {
		if (index === undefined) {
			// console.log('Error: scrollToFullSizeBlock function need index of fullSizeBlock!');
			return;
		}

		if (fullSizeBlocks[index] === undefined) {
			// console.log('Error: no fullSizeBlock with index ' + index + '!');
			return;
		}
		
		// console.log('going to index ' + index + ', block #' + (index + 1));
		// fullSizeBlocks[index].scrollIntoView({ behavior: 'smooth' }); // По непонятной причине такая перемотка не работает в мобильном хроме после свайпа!
		
		const topOfBlock = fullSizeBlocks[index].getBoundingClientRect().top + window.pageYOffset;
		window.scrollTo({ top: topOfBlock, left: 0, behavior: 'smooth' });
	}

	function addActiveClassToLink(index) {
		if (sideLinksBlockItems.length === 0) { return; }
		
		if (sideLinksBlockItems[index] === undefined) {
			// console.log('Error! No link to fullSizeBlock with index ' + index);
			return;
		}
		
		sideLinksBlockItems[index].classList.add('active');
	}

	function removeActiveClassFromAllLinks() {
		for (let i = 0; i < sideLinksBlockItems.length; i++) {
			sideLinksBlockItems[i].classList.remove('active');
		}
	}

	function isElemOrAncestorEditable(elem) {
		const inputTypes = [ 'date', 'datetime-local', 'email', 'month', 'number', 'password', 'search', 'tel', 'text', 'time', 'url', 'week', 'datetime', 'range' ];

		if (elem.closest('textarea')) { return true; }

		if (elem.closest('[contenteditable]')) { return true; }
			
		const input = elem.closest('input');
		if (input !== null) {
			if (input.hasAttribute('type') === false) { return true; } // 'input' tag without type attribute means type="text"
			
			for (let i = 0; i < inputTypes.length; i++) {
				if (inputTypes[i] === input.getAttribute('type')) { return true; }
			}
		}
		
		return false;
	}

	function handleSideLinksClick(e) {
		const linkItem = e.target.closest('.linksToSlides .item');
		if (linkItem === null) { return; }
		
		for (let i = 0; i < sideLinksBlockItems.length; i++) {
			if (linkItem === sideLinksBlockItems[i]) {
				scrollToFullSizeBlock(i);
				removeActiveClassFromAllLinks();
				addActiveClassToLink(i);
				break;
			}
		}
	}

	function delayDecorator(f, ms) {
		let timer = null;
		return function() {
			clearTimeout(timer);
			timer = setTimeout(f, ms);
		};
	}

	let handleScroll = function() {
		highlightActiveSlide();
	};

	handleScroll = delayDecorator(handleScroll, 100);

	function highlightActiveSlide() {
		const indexOfCurrentFullSizeBlock = getIndexOfCurrentFullSizeBlock();
		if (indexOfCurrentFullSizeBlock === null) { return; }
		removeActiveClassFromAllLinks();
		addActiveClassToLink(indexOfCurrentFullSizeBlock);
	}
	
	document.addEventListener('wheel', handleWheel, { passive: false });
	document.addEventListener('keydown', handleKeydown, { passive: false });
	document.addEventListener('scroll', handleScroll, { passive: false });
	sideLinksBlock.addEventListener('click', handleSideLinksClick);

	document.addEventListener('touchstart', handleTouchStart);
	document.addEventListener('touchend', handleTouchEnd);
	document.addEventListener('touchmove', handleTouchMove, { passive: false });
	document.addEventListener('touchcancel', handleTouchCancel);

	const swipeObj = {
		oneFinger: false,
		wasMove: false,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0,
		startScreenX: 0,
		startScreenY: 0,
		elem: null,
		startSlideIndex: null,
		windowScrolled: 0,
	};

	function handleTouchStart(e) {
		// console.log('handleTouchStart');
				
		// Если пользователь докасается 2-мя и более пальцами, то не анализирую тач-движения на наличие свайпа
		if (e.touches.length > 1) {
			swipeObj.oneFinger = false;
			return;
		}
		
		swipeObj.elem = null;

		// Проверка: чтобы не мешать прокручивать прокручиваемые элементы за исключением элемента body
		let elem = e.target;
		while(elem !== document.body) {
			if (elem.scrollHeight > elem.clientHeight) {
				return;
			}
			elem = elem.parentNode;
		}
			
		swipeObj.elem = document;
		
		swipeObj.startSlideIndex = getIndexOfCurrentFullSizeBlock();
		swipeObj.oneFinger = true;
		swipeObj.startX = e.touches[0].screenX;
		swipeObj.startY = e.touches[0].screenY;
		swipeObj.startScreenX = e.touches[0].screenX;
		swipeObj.startScreenY = e.touches[0].screenY;
		swipeObj.windowScrolled = document.documentElement.scrollTop;
	}

	function handleTouchEnd() {
		// console.log('handleTouchEnd');
		if (!swipeObj.oneFinger || !swipeObj.wasMove) 
		{
			// Не анализирую на наличие свайпа
			return;
		}

		if (!swipeObj.elem) {
			// Обязательно нужно сбросить как минимум oneFinger и wasMove. Иначе будут глючный ненужный свайп, если
			// кликнуть на элементе, а потом сделать свайп в любом другом месте, а потом снова кликнуть на элементе.
			swipeObj.oneFinger = false;
			swipeObj.wasMove = false;
			swipeObj.startX = 0;
			swipeObj.startY = 0;
			swipeObj.endX = 0;
			swipeObj.endY = 0;
			return;
		}

		if (swipeObj.startY > swipeObj.endY) {
			if (Math.abs(swipeObj.startY - swipeObj.endY) > 16) { // если разница по вертикали между началом и концом более 16 пикселей
				// console.log('Свайп был вверх');
				const indexOfCurrentFullSizeBlock = getIndexOfCurrentFullSizeBlock();
				if (swipeObj.startSlideIndex !== indexOfCurrentFullSizeBlock) {
					scrollToFullSizeBlock(indexOfCurrentFullSizeBlock);
				} else {
					if (indexOfCurrentFullSizeBlock === null) { return; }
					if (indexOfCurrentFullSizeBlock === fullSizeBlocks.length - 1) { return; }
					const nextIndex = indexOfCurrentFullSizeBlock + 1;
					scrollToFullSizeBlock(nextIndex);
					removeActiveClassFromAllLinks();
					addActiveClassToLink(nextIndex);
				}
			}
		} else {
			if (Math.abs(swipeObj.startY - swipeObj.endY) > 16) { // если разница по вертикали между началом и концом более 16 пикселей
				// console.log('Свайп был вниз');
				const indexOfCurrentFullSizeBlock = getIndexOfCurrentFullSizeBlock();
				if (swipeObj.startSlideIndex !== indexOfCurrentFullSizeBlock) {
					scrollToFullSizeBlock(indexOfCurrentFullSizeBlock);
				} else {
					if (indexOfCurrentFullSizeBlock === null) { return; }
					if (indexOfCurrentFullSizeBlock === 0) { return; }
					const nextIndex = indexOfCurrentFullSizeBlock - 1;
					scrollToFullSizeBlock(nextIndex);
					removeActiveClassFromAllLinks();
					addActiveClassToLink(nextIndex);
				}
			}
		}

		swipeObj.oneFinger = false;
		swipeObj.wasMove = false;
	}

	function handleTouchMove(e) {
		if (swipeObj.elem) { e.preventDefault(); } // Чтобы не было скролла в браузере
		// console.log('handleTouchMove');
		swipeObj.endX = e.touches[0].screenX;
		swipeObj.endY = e.touches[0].screenY;
		
		// Имитирую скроллинг тачем
		// Нельзя использовать behavior: 'smooth'! Иначе не будет скролла как надо
		window.scrollTo(0, (swipeObj.windowScrolled + swipeObj.startScreenY - e.touches[0].screenY));
		swipeObj.wasMove = true;
	}

	function handleTouchCancel() {
		// console.log('handleTouchCancel');
		swipeObj.oneFinger = false;
		swipeObj.wasMove = false;
	}

	function fillSideLinks() {
		for (let i = 0; i < fullSizeBlocks.length; i++) {
			const oneLinkBlock = document.createElement('div');
			oneLinkBlock.classList.add('item');
			sideLinksBlock.appendChild(oneLinkBlock);
		}

		sideLinksBlockItems = document.querySelectorAll('.linksToSlides .item'); // need update, because querySelectorAll() returns static collection
	}

	document.addEventListener('DOMContentLoaded', fillSideLinks);
	
	document.addEventListener('DOMContentLoaded', highlightActiveSlide);
}();
