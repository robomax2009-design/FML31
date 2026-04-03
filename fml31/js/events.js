(function() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var messageElement = document.getElementById('dynamicMessage');
    var header = document.getElementsByClassName('header')[0];
    var body = document.body;
    
    if (messageElement) {
        if (month === 3 && day >= 6 && day <= 11) {
            messageElement.textContent = 'Жіночки, с 8 марта!';
            messageElement.style.color = '#c41055';
            messageElement.style.fontSize = 'xxx-large';
            messageElement.style.fontWeight = 'bold';
            messageElement.style.fontFamily = 'DwarvenStonecraftCyr';
            body.style.backgroundColor = "#3b0217";
            header.style.backgroundColor = "#7a012e";
        }
    }
})();

(function() {
    var today = new Date();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    
    function getRandomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
    
    function getRandomFont() {
        var fonts = [
            'Arial', 'Verdana', 'Times New Roman', 'Georgia', 
            'Courier New', 'Brush Script MT', 'Comic Sans MS', 
            'Impact', 'Lucida Console', 'Tahoma', 'Trebuchet MS',
            'Franklin Gothic Medium', 'Segoe UI', 'Roboto', 'Open Sans'
        ];
        return fonts[Math.floor(Math.random() * fonts.length)];
    }
    
    function applyRandomStyles() {
        var allElements = document.querySelectorAll('*');
        
        for (var i = 0; i < allElements.length; i++) {
            var elem = allElements[i];
            
            if (elem.tagName === 'HTML') continue;
            
            elem.style.color = getRandomColor();
            elem.style.fontFamily = getRandomFont();
            
            if (elem.tagName !== 'BODY' && elem.tagName !== 'SCRIPT' && elem.tagName !== 'STYLE') {
                elem.style.backgroundColor = getRandomColor();
            }
            
            if (Math.random() > 0.7) {
                elem.style.border = '2px solid ' + getRandomColor();
                elem.style.padding = '5px';
            }
        }
        
        document.body.style.backgroundColor = getRandomColor();
        document.body.style.color = getRandomColor();
        document.body.style.fontFamily = getRandomFont();
        
        var header = document.getElementsByClassName('header')[0];
        if (header) {
            header.style.backgroundColor = getRandomColor();
            header.style.color = getRandomColor();
            header.style.fontFamily = getRandomFont();
        }
        
        var messageElement = document.getElementById('dynamicMessage');
        if (messageElement) {
            messageElement.style.color = getRandomColor();
            messageElement.style.fontFamily = getRandomFont();
            messageElement.style.backgroundColor = getRandomColor();
        }
        
        var notification = document.getElementById('aprilNotification');
        if (notification) {
            notification.style.backgroundColor = getRandomColor();
            notification.style.color = getRandomColor();
            notification.style.fontFamily = getRandomFont();
        }
    }
    
    var isAprilFirst = (month === 4 && day === 1);
    
    if (isAprilFirst) {
        applyRandomStyles();
        
        setInterval(function() {
            applyRandomStyles();
        }, 1000);
        
        var messageElement = document.getElementById('dynamicMessage');
        if (messageElement) {
            messageElement.textContent = '🤡🤡🤡';
            messageElement.style.fontSize = 'xxx-large';
            messageElement.style.fontWeight = 'bold';
            messageElement.style.padding = '20px';
            messageElement.style.borderRadius = '15px';
            messageElement.style.textAlign = 'center';
        }
        
        var notification = document.createElement('div');
        notification.id = 'aprilNotification';
        notification.textContent = '🤡';
        notification.style.position = 'fixed';
        notification.style.bottom = '10px';
        notification.style.right = '10px';
        notification.style.fontSize = '14px';
        notification.style.fontWeight = 'bold';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '10px';
        notification.style.zIndex = '9999';
        notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        notification.style.cursor = 'pointer';
        notification.onclick = function() {
            this.style.display = 'none';
        };
        document.body.appendChild(notification);
        
        setTimeout(function() {
            if (notification && notification.parentNode) {
                notification.style.opacity = '0';
                setTimeout(function() {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
    }
})();