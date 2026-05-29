const images = function () {
    let main = document.getElementsByTagName('main')[0]

    image_url = ['https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1760427168563_johnmayer1240x300gs.jpg', 
                'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1757148047631_6thsepplaycardsep25hpptmdesktop.jpg', 
                'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1760683702613_bandlandweb.jpg', 
                'https://assets-in-gm.bmscdn.com/promotions/cms/creatives/1760009849192_mumbaiwebbanner.jpg']

    for (let i = 0; i < image_url.length; i++) {
        let image = document.createElement('img')
        image.setAttribute('class', 'slide')
        image.src = image_url[i]
        main.appendChild(image)
    }
}

images();

function signIn() {
    let div = document.getElementById('signIn')
    window.location.href = '/login'
}

let email, password
let usrData = {
    email: undefined,
    password: undefined
}

async function logOutBtn () {
    let params = new URLSearchParams(window.location.search)
    let status = params.get('status')
    
    if (status === 'ok') {
        let btn = document.getElementById('signIn')
        btn.innerText = "Log Out"

        id = params.get('id')
        email = params.get('email')
        password = params.get('password')
        
        // Pop Box to correct the loggout function

        usrData.id = id
        usrData.email = email
        usrData.password = password

        console.log(usrData)

        const res = await fetch('/api/getdata', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(usrData)
        })
    }
}

logOutBtn()

var slides = document.querySelectorAll(".slide")
var count = 0

slides.forEach((slide, index) => {
    slide.style.left = `${index * 100}%`
})

const goPrev = () => {
    count--
    slideImage()
}

const goNext = () => {
    count++
    slideImage()
}

const slideImage = () => {
    slides.forEach((slide) => {
        slide.style.transform = `translateX(-${count * 100}%)`
        console.log(count)
    })
}

const createCarousel = (containerSelector, images, visibleMovies = 5) => {
    const container = document.querySelector(containerSelector);

    images.forEach((url, index) => {
        const img = document.createElement('img');
        img.classList.add('movies-slide');
        img.src = url;
        container.appendChild(img);

        img.addEventListener('click', function () {
            window.location.href = `/book/?id=${index}`
            // window.location.href = `/movieBook.html?id=${index}`
        })
    });

    let currentIndex = 0;
    const totalMovies = images.length;
    const maxIndex = totalMovies - visibleMovies;

    const updateCarousel = () => {
        const offset = (currentIndex * (100 / visibleMovies));
        container.style.transform = `translateX(-${offset}%)`;
    }

    const prevBtn = container.parentElement.querySelector('.prev');
    const nextBtn = container.parentElement.querySelector('.next');

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateCarousel();
    });

    updateCarousel();
}

const createEventCarousel = (containerSelector, images, visibleMovies = 5) => {
    const container = document.querySelector(containerSelector);

    images.forEach(url => {
        const img = document.createElement('img');
        img.classList.add('movies-slide-2');
        img.src = url;
        container.appendChild(img);
    });

    let currentIndex = 0;
    const totalMovies = images.length;
    const maxIndex = totalMovies - visibleMovies;

    const updateCarousel = () => {
        const offset = (currentIndex * (100 / visibleMovies));
        container.style.transform = `translateX(-${offset}%)`;
    }

    const prevBtn = container.parentElement.querySelector('.prev');
    const nextBtn = container.parentElement.querySelector('.next');

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(currentIndex - 1, 0);
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(currentIndex + 1, maxIndex);
        updateCarousel();
    });

    updateCarousel();
}

// let movies_url = ['https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-MTQ0SysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00447585-pfbqxwkcdx-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-MTQ4SysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00443268-btqvfuwbls-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@like_202006280402.png,lx-24,ly-617,w-29,l-end:l-text,ie-Mi4zSysgTGlrZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00451887-gltnqntzvk-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS4zLzEwICA0NTJLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00377351-ctlsgzebdx-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-Ny40LzEwICAyMi4xSysgVm90ZXM%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00388406-gkgrxbdjxr-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS43LzEwICBFYXJseSBSYXRpbmdz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00466772-ntymwsaycc-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC4yLzEwICA2OUsrIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00450799-uprjscxell-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OC45LzEwICA2LjFLKyBWb3Rlcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00450272-xqevcpscdt-portrait.jpg', 
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS43LzEwICAyMjArIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00459408-jlwkewdzwa-portrait.jpg',
//     'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-image,i-discovery-catalog@@icons@@star-icon-202203010609.png,lx-24,ly-615,w-29,l-end:l-text,ie-OS42LzEwICAyNjArIFZvdGVz,fs-29,co-FFFFFF,ly-612,lx-70,pa-8_0_0_0,l-end/et00003331-qqdjaadhxd-portrait.jpg']

async function loadMovies() {
  const response = await fetch('/api/movies');
  const movies = await response.json();

  const imageUrls = movies.map(movie => movie.poster_url);

  createCarousel('.movies-section:nth-of-type(1) .movies', imageUrls, 5);
}

loadMovies();

let events_url = ['https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:w-300/icc-womens-2025-best-of-live-events-collection-202508300121.png', 
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-NzUrIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/comedy-shows-collection-202211140440.png',
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/theatre-shows-collection-202211140440.png',
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTUrIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/kids-banner-desktop-collection-202503251132.png',
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MzArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/music-shows-collection-202211140440.png',
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTUrIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/arts-crafts-collection-202211140440.png',
    'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MjArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/workshop-and-more-web-collection-202211140440.png']

// createCarousel('.movies-section:nth-of-type(1) .movies', movies_url, 5);
createEventCarousel('.movies-section:nth-of-type(2) .movies', events_url, 5);

let music_url = ['https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCA1IERlYw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00458414-hyuylhvnqe-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyNyBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00460387-kcjuyyzmbb-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyMCBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00456626-xdvmkkvucf-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00455998-fxqtjtrpqm-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNiBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00467005-dzxftvbgxh-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCA1IERlYw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00466272-guslhpyslq-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAxOSBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00463566-bhymdpvzal-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxIE5vdg%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00465839-hvtargjmvz-portrait.jpg']

let outdoor_url = ['https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAxNSBOb3Ygb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00462287-aqcwcduxps-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyNiBPY3Q%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end:l-text,ie-UFJPTU9URUQ%3D,co-FFFFFF,bg-DC354B,ff-Roboto,fs-20,lx-N16,ly-12,lfo-top_right,pa-12_14_12_14,r-6,l-end/et00397951-jpkfcrkvrx-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAxNCBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00449720-uzllarbwad-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCA4IE5vdiBvbndhcmRz,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00376688-dqcvjurbhl-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyNyBEZWM%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355125-vzlbtnrxjl-portrait.jpg',
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-VHVlLCAyMSBPY3Qgb253YXJkcw%3D%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00466592-btbrdaajrx-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-RnJpLCAyMSBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00460676-vjfdkxashb-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U2F0LCAyNSBPY3Q%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00355585-mqeewdllbc-portrait.jpg', 
    'https://assets-in.bmscdn.com/discovery-catalog/events/tr:w-400,h-600,bg-CCCCCC:w-400.0,h-660.0,cm-pad_resize,bg-000000,fo-top:l-text,ie-U3VuLCAyMyBOb3Y%3D,fs-29,co-FFFFFF,ly-612,lx-24,pa-8_0_0_0,l-end/et00459528-armsrxegmu-portrait.jpg']

createCarousel('.movies-section:nth-of-type(3) .movies', music_url, 5)
createCarousel('.movies-section:nth-of-type(4) .movies', outdoor_url, 5)

let list_show = document.getElementById('ListYourShow')
list_show.addEventListener('click', function () {
    window.location.href = '/myBookings.html'
})