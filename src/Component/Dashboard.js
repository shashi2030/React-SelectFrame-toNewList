import React from "react";
require('./style.css');

const gallery = [
    'image1.jpg',
    'image2.jpg',
    'image3.jpg',
    'image4.jpg',
    'image5.jpg',
    'image6.jpg',
    'image7.jpg',
    'image8.jpg',
    'image9.jpg',
    'image10.jpg'
]
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftX: 0,
            rightX: 0,
            width: 0,
            imagePosition: 0,
            totalSelectedImage: 0
        }
    }
    componentDidMount() {
        this.makeResizableDiv('.resizable')
    }
    makeResizableDiv = (div) => {
        const resizers = document.querySelectorAll(div + ' .resizer')
        for (let i = 0; i < resizers.length; i++) {
            const element = document.querySelector(div);
            const minimum_size = 20;
            let original_width = 0;
            let original_x = 0;
            let original_mouse_x = 0;
            const currentResizer = resizers[i];
            currentResizer.addEventListener('mousedown', function (e) {
                e.preventDefault();
                original_width = parseFloat(getComputedStyle(element, null).getPropertyValue('width').replace('px', ''));
                original_x = element.getBoundingClientRect().left;
                original_mouse_x = e.pageX;
                window.addEventListener('mousemove', resize)
                window.addEventListener('mouseup', stopResize)
            })

            const resize = (e) => {
                const parentElement = document.getElementById('gallery');
                const leftMax = parentElement.getBoundingClientRect().left;
                const rightMax = parentElement.getBoundingClientRect().right - 100;
                let leftX = original_x;
                let width = original_width;

                if (currentResizer.classList.contains('right')) {
                    width = original_width + (e.pageX - original_mouse_x);
                    if (width > minimum_size && width < rightMax) {
                        element.style.width = width + 'px'
                    }
                }
                else if (currentResizer.classList.contains('left')) {
                    width = original_width - (e.pageX - original_mouse_x);

                    if (width > minimum_size && (original_x + (e.pageX - original_mouse_x)) >= leftMax) {
                        leftX = original_x + (e.pageX - original_mouse_x);
                        element.style.width = width + 'px';
                        element.style.left = leftX + 'px';
                    }
                }
            }

            function stopResize() {
                window.removeEventListener('mousemove', resize)
            }
        }
    }

    createFrame = () => {
        const resizers = document.querySelectorAll('.resizer');
        const leftXPos = resizers[0].getBoundingClientRect().left;
        const rightXPos = resizers[1].getBoundingClientRect().left;
        const totalImage = gallery.length;
        const galleryLength = 1000;
        const imageLength = galleryLength / totalImage;
        const selectedPosition = rightXPos - leftXPos;
        const totalSelectedImage = Math.floor(selectedPosition / imageLength);
        const imagePosition = Math.floor((leftXPos - 95) / imageLength);
        this.setState({
            totalSelectedImage: totalSelectedImage,
            imagePosition: imagePosition
        })
    }

    render() {
        const { imagePosition, totalSelectedImage } = this.state;
        let selectedList = [];
        for (let i = 0; i <= totalSelectedImage; i++) {
            selectedList.push(imagePosition + i)
        }
        return (
            <div className="container">
                <div className="inner-container">
                <div id="gallery">
                    {
                        gallery && gallery.map((item, index) => {
                            return <img src={"./images/" + item} key={index} className={selectedList.includes(index) ? 'selected' : null} alt={"image" + index + 1} />
                        })
                    }
                </div>
                <div className='resizable'>
                    <div className='resizers'>
                        <div className='resizer left'></div>
                        <div className='resizer right'></div>
                    </div>
                </div>
                </div>
                <div className="header">
                    <button onClick={this.createFrame}>Create New Frame</button>
                </div>
                <div className="inner-container">
                <div className="output">
                {
                        gallery && gallery.map((item, index) => {
                               return selectedList.includes(index) ? <img src={"./images/" + item} key={index} alt={"image" + index + 1} /> : null
                        })
                    }
                </div>
                </div>
            </div>
        );
    }
}

export default Dashboard;