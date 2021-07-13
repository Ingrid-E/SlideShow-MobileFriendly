//Followed https://youtu.be/5bxFSOA5JYo Traversy Media Tutorial

const slider = document.querySelector('.slider-container'),
      slides = Array.from(document.querySelectorAll('#slideShow li'))

let isDragging = false,
    startPos = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    animationID = 0,
    currentIndex = 0,
    automaticDir = 'right'

slides.forEach((slide, index)=>{
    const slideImage = slide.querySelector('img')
    /**
     * Function so image is not draggable in the slides.
     * Is it important for mobile? I don't think so might remove
     */
    slideImage.addEventListener('dragstart', (e)=> e.preventDefault())

    //Touch events
    slide.addEventListener('touchstart', touchStart(index)) //When clicking on the image
    slide.addEventListener('touchend', touchEnd) //When stopped clicking the image
    slide.addEventListener('touchmove', touchMove) //When dragging the screen

    //Mouse Events
    slide.addEventListener('mousedown', touchStart(index)) //When clicking on the image
    slide.addEventListener('mouseup', touchEnd) //When stopped clicking the image
    slide.addEventListener('mouseleave', touchEnd) //When it leaves the slide
    slide.addEventListener('mousemove', touchMove) //When dragging the screen
})

window.addEventListener('resize', setPositionByIndex)

//Remove save img menu that can be annoying
window.oncontextmenu = function(event){
    event.preventDefault()
    event.stopPropagation()
    return false
}

function touchStart(index){
    return function(event){
        currentIndex = index
        startPos = getPositionX(event)
        isDragging = true
        animationID = requestAnimationFrame(animation)
        slider.classList.add('grabbing')
        slider.classList.remove('automatic')
        clearInterval(automatic)
    }
}

function touchEnd(){
    cancelAnimationFrame(animationID)
    isDragging = false
    const movedBy = currentTranslate - prevTranslate

    if(movedBy < -100 && currentIndex < slides.length - 1) currentIndex += 1

    if(movedBy > 100 && currentIndex > 0) currentIndex -= 1

    setPositionByIndex()

    slider.classList.remove('grabbing')
    automatic = setInterval(automaticSlides, 3000)
}

function touchMove(event){
    if(isDragging){
        const currentPosition = getPositionX(event)
        currentTranslate = prevTranslate + currentPosition - startPos
    }
}

//Get Starting x position
function getPositionX(event){
    return  event.type.includes('mouse')
            ? event.pageX
            : event.touches[0].clientX
}

function animation(){
    setSliderPosition()
    if(isDragging) requestAnimationFrame(animation)
}

function setSliderPosition(){
    slider.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex(){
    currentTranslate = currentIndex * -(slider.clientWidth + 300)
    prevTranslate = currentTranslate
    setSliderPosition()
}

//Automatic SlideShow

function automaticSlides(){

    if(currentIndex == 0) automaticDir = 'right'
    if(currentIndex == slides.length - 1) automaticDir = 'left'

    if(automaticDir == 'right') currentIndex +=1
    if(automaticDir == 'left') currentIndex -=1

    console.log(currentIndex)
    slider.classList.add('automatic')
    setPositionByIndex()
}

let automatic = setInterval(automaticSlides, 3000)