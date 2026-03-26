const width = 3;

let current = [];
create = function(x=50) {
    const candle = document.createElement('div');
    const wick = document.createElement('div');
    candle.style.zIndex = "-9999";
    wick.style.zIndex = "-9999";

    candle.style.position = 'absolute';
    candle.style.left = `${x}%`;
    wick.style.position = 'absolute';
    wick.style.left = `${x + (width * 24 / 50)}%`;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const documentHeight = document.body.scrollHeight;
    
    const minVisible = 10;
    const maxVisible = 80;
    const startTopPercent = minVisible + Math.floor(Math.random() * (maxVisible - minVisible));
    const finalHeight = 5 + Math.floor(Math.random() * 15);
    
    const isGreen = Math.random() > 0.5;
    
    if(isGreen) {
        const wickExtraTop = 2 + Math.floor(Math.random() * 8);
        const wickExtraBottom = 2 + Math.floor(Math.random() * 8);
        const wickTotalHeight = finalHeight + wickExtraTop + wickExtraBottom;
        
        const candleBottomPercent = 100 - startTopPercent;
        const candleBottom = scrollTop + (candleBottomPercent * viewportHeight / 100);
        const candleTop = candleBottom - (finalHeight * viewportHeight / 100);
        const wickTop = candleTop - (wickExtraTop * viewportHeight / 100);
        
        const finalHeightPx = finalHeight * viewportHeight / 100;
        const wickTotalHeightPx = wickTotalHeight * viewportHeight / 100;
        
        candle.style.bottom = `${documentHeight - candleBottom}px`;
        candle.style.top = 'auto';
        candle.style.backgroundColor = "#22ff00";
        candle.style.height = '0';
        
        wick.style.bottom = `${documentHeight - (wickTop + wickTotalHeightPx)}px`;
        wick.style.top = 'auto';
        wick.style.backgroundColor = "#22ff00";
        wick.style.height = '0';
        
        candle.dataset.finalHeightPx = finalHeightPx;
        wick.dataset.finalHeightPx = wickTotalHeightPx;
        
    } else {
        const wickExtraTop = 2 + Math.floor(Math.random() * 8);
        const wickExtraBottom = 2 + Math.floor(Math.random() * 8);
        const wickTotalHeight = finalHeight + wickExtraTop + wickExtraBottom;
        
        const candleTop = scrollTop + (startTopPercent * viewportHeight / 100);
        const wickTop = candleTop - (wickExtraTop * viewportHeight / 100);
        
        const finalHeightPx = finalHeight * viewportHeight / 100;
        const wickTotalHeightPx = wickTotalHeight * viewportHeight / 100;
        
        candle.style.top = `${candleTop}px`;
        candle.style.backgroundColor = "red";
        candle.style.height = '0';
        
        wick.style.top = `${wickTop}px`;
        wick.style.backgroundColor = "red";
        wick.style.height = '0';
        
        candle.dataset.finalHeightPx = finalHeightPx;
        wick.dataset.finalHeightPx = wickTotalHeightPx;
    }
    
    candle.style.width = `${width}%`;
    candle.classList.add("candle");
    candle.style.opacity = '0';

    wick.style.width = `${width / 25}%`;
    wick.classList.add("wick");
    wick.style.opacity = '0';

    document.body.appendChild(candle);
    document.body.appendChild(wick);
    
    void candle.offsetHeight;
    void wick.offsetHeight;
    
    setTimeout(function () {
        candle.style.opacity = '0.6';
        candle.style.height = `${candle.dataset.finalHeightPx}px`;
        wick.style.opacity = '0.6';
        wick.style.height = `${wick.dataset.finalHeightPx}px`;
        
        setTimeout(function () {
            candle.style.opacity = '0';
            wick.style.opacity = '0';
            setTimeout(function () {
                candle.remove();
                wick.remove();
                const index = current.indexOf(x);
                if (index !== -1) {
                    current.splice(index, 1);
                }
            }, 3000);
        }, 3000);
    }, 50);
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

document.addEventListener('DOMContentLoaded', async function() {
    check = function(x) {
        for(let i = 0; i < current.length; i++) {
            if(Math.abs(x - current[i]) < width) {
                return false;
            }
        }
        return true;
    };
    while(true){
        x = Math.random() * (100 - width * 2);
        while(!check(x)){
            x = Math.random() * (100 - width * 2);
        }
        create(x);
        current.push(x);
        await sleep(400);
    }
});

const el = document.getElementById('header');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            el.classList.add('visible');
        } else {
            el.classList.remove('visible');
        }
    });
}, { threshold: 0.3 });

observer.observe(el);