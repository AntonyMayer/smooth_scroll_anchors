/**
 * Smooth scroll to anchors for HCP
 */

class Anchor {
    constructor(link) {
        this.state = {  
            prevPosition: 0,    // will be updated on click
            scrollTo: 0,        // will be updated on click
            speed: 150          // px per animation frame 
        };
        this.animateScroll = this.animateScroll.bind(this);
        this.onClick(link);     // adds event listener
    }
    onClick(link) {
        link.addEventListener('click', e => {
            // prevent defaults
            e.preventDefault();
            e.stopPropagation();
            // update state and scroll
            this.updateState(link);     
            this.animateScroll();
        })
    }
    updateState(link) {
        // check if current breakpoint is "small"
        // find target position by 'data-href' attr on a link
        // optionally adjust scroll by adding "data-desktop" or "data-mobile" values to anchor
        let isMobile = store.getState().currentBreakpoint === "small" ? true : false,
            headerSelector =  isMobile ? 'indication-slides-trigger' : 'header-inline',
            anchor = document.getElementById(link.dataset.href),
            anchorOffset = anchor.offsetTop,
            adjustment = Number(isMobile ? anchor.dataset.mobile : anchor.dataset.desktop) || 0, 
            containerOffset = containerOffset = document.getElementById('middle').offsetTop,
            headerHeight = document.getElementsByClassName(headerSelector)[0].offsetHeight,
            total = anchorOffset + containerOffset - headerHeight - adjustment;

        // update lastKnownPosition with current scroll Y data
        // reset speed
        this.state.prevPosition = window.pageYOffset;
        this.state.speed = 150;
            
        // calculate scroll value based on element position 
        // if too close to the top header will not be shrinked
        // also consider mobile view to adjust scroll value
        if (total < 300) this.state.scrollTo = total - 15;  
        else this.state.scrollTo = total + (isMobile ? -5 : 20);  
    }
    animateScroll() {
        // check diff between current and previous position
        // if 3 times more than speed => block 1 (full speed)
        // if less than speed => block 2 (start slowing)
        // if less than 1 => block 3 (finalize)
        let delta = this.state.scrollTo - this.state.prevPosition;

        // 1 
        if (this.state.scrollTo > this.state.prevPosition && delta > this.state.speed*3) {
            this.state.prevPosition += this.state.speed;
            window.scrollTo(0, this.state.prevPosition);
            requestAnimationFrame(this.animateScroll);
        } else if (delta > 1) {
        // 2
            this.state.speed = this.state.speed / 2;
            this.state.prevPosition += this.state.speed;
            window.scrollTo(0, this.state.prevPosition);
            requestAnimationFrame(this.animateScroll);   
        } else {
        // 3
            window.scrollTo(0, this.state.scrollTo); 
        }
    }
}

/**
 * Init anchors
 */
window.addEventListener('load', _=> {
    [...document.getElementsByClassName('anchor-link-navigation__link')].forEach(anchor => {
        new Anchor(anchor);
    });
});
