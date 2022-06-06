// no tocar
import utils from './utils';
utils();

// empezar a importar modulos desde aqui
import Muuri from 'muuri';
import dayjs from 'dayjs'



/**
 * Vars
 */
let grid;
let layout = 'personal_list';
let gifs = [];
let savedGifs;
let savedSearches = [];
let c = 0;
let messages = {
    alreadySaved: 'Ya has guardado esta imagen',
    saved: 'Guardado correctamente',
    removed: 'Borrado correctamente'
}



/**
 * CARGADO DE DATOS GIFS
 */
/**
 * fetchGifs
 */
const fetchGifs = async(q) => {

    let query = q;
    let limit = 25;


    let urlbase = 'https://api.giphy.com/v1/gifs/search?api_key=eQW0mnKWewCW3ducVNhY6mKp4g2sTJQd'
    let url = urlbase + '&q=' + query + '&limit' + limit;
    let giphyRequest = await fetch(url).then(rData => rData.json()).then(d => d);

    gifs = giphyRequest.data;
    render();

};

/**
 * loadSavedGifs
 */
const loadSavedGifs = () =>{
    savedGifs = JSON.parse(localStorage.getItem('savedGifs')) || [];
}

/**
 * loadSavedSearches
 */
const loadSavedSearches = () =>{
    savedSearches = JSON.parse(localStorage.getItem('savedSearches')) || [];
}

/**
 * loadWelcome
 */
const loadWelcomeMessage = () =>{
    c = JSON.parse(localStorage.getItem('welcome')) || [];
}


/**
 * MOFICACIÓN Y GUARDADO DATOS
 */
/**
 * savePicture
 */
const savePicture = newPicture => {

    let index = savedGifs.findIndex(savedGif => savedGif.src == newPicture.src);
    
    if(index < 0){
        savedGifs.push(newPicture);
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));

        launchAlert('info', messages.saved);
    } else {
        launchAlert('danger', messages.alreadySaved);
    }

};

/**
 * removePicture
 */
const removePicture = url => {
    let index = savedGifs.findIndex(savedGif => savedGif.src == url);
    
    savedGifs.splice(index, 1);
    localStorage.setItem('savedGifs', JSON.stringify(savedGifs));

    launchAlert('danger', messages.removed);
    render();
};


/**
 * saveSearch
 */
const saveSearch = (value) => {
    let searchBox = document.querySelector('.searchbox input');
    let search_time = new Date;
    let info = {
        text: searchBox.value,
        time: dayjs(search_time).format('hh:mm')
    }
    savedSearches.push(info);
    localStorage.setItem('savedSearches', JSON.stringify(savedSearches));
};

/**
 * EVENTOS
 * Eventos Globales
 */

const initGlobalEvents = () => {
    let searchBox = document.querySelector('.searchbox input');
    searchBox.addEventListener('change', (ev) => {

        layoutShifter('search_list');
        fetchGifs(searchBox.value);
        saveSearch(searchBox.value)
    });

    let backButton = document.querySelector('.back_button');
    backButton.addEventListener('click', () => {
        layoutShifter('personal_list');
        searchBox.value = '';
        render();
    });


    let openSidebar = document.querySelector('.open_sidebar');
    let historySidebar = document.querySelector('.history_sidebar'); 

    openSidebar.addEventListener('click', () => {
        historySidebar.classList.remove('hidden');
        historySidebar.classList.add('openned');
        renderSearches();
    });

    let closeSidebar = document.querySelector('.history_info_header .fa-close');
    closeSidebar.addEventListener('click', () => {
        historySidebar.classList.add('hidden');
        renderSearches();
    });

    let removeGifs = document.querySelector('.searchbox .fa-trash');
    removeGifs.addEventListener('click', () => {
        savedGifs.splice(0, savedGifs.length);
        localStorage.setItem('savedGifs', JSON.stringify(savedGifs));
        render();
        launchAlert('danger', messages.removed);
    });

};

/**
 * EVENTOS
 * initEvents
 */
const initEvents = () =>{
    let pictures = document.querySelectorAll('.gallery_item');
    
    if(layout == 'personal_list'){
        pictures.forEach(picture => {
            let icon = picture.querySelector('.remove_picture');
            icon.addEventListener('click', () => {
                let url = picture.querySelector('img').src;
                removePicture(url);
            });
        });
    }

    if(layout == 'search_list'){
        pictures.forEach(picture => {
            let icon = picture.querySelector('.save_picture');
            icon.addEventListener('click', () => {

                let newPicture = {
                    title: picture.querySelector('h4').innerText,
                    src: picture.querySelector('img').src,
                    author: picture.querySelector('.author').innerText,
                    width: picture.querySelector('img').width,
                    height: picture.querySelector('img').height
                };

                savePicture(newPicture);
            });
        });
    };
};


/**
 * popUp_welcome
 */
let popUp_welcome = () => {
    let popUp = document.querySelector('.popup_first');
    let closePopUp = document.querySelector('.popup_content .button');
 
    if (c == 0){
        popUp.classList.remove('hidden');
        closePopUp.addEventListener('click', () => {
            popUp.classList.add('hidden');
        });
    }
    c = c + 1;
    localStorage.setItem('welcome', JSON.stringify(c));
};


/**
 * Grid Creator
 */
const gridCreator = () => {
    grid = new Muuri('.gallery_items');
};

/**
 * Layout Shifter
 */


const layoutShifter = (layoutIn) =>{
    layout = layoutIn;

    if(layout == 'personal_list'){
        document.querySelector('.container').classList.remove('search_list');
        document.querySelector('.container').classList.add('personal_list');
        document.querySelector('.fa-trash').classList.remove('hidden');
        document.querySelector('.open_sidebar').classList.remove('hidden');
    }
    if(layout == 'search_list'){
        document.querySelector('.container').classList.remove('personal_list');
        document.querySelector('.container').classList.add('search_list');
        document.querySelector('.fa-trash').classList.add('hidden');
        document.querySelector('.open_sidebar').classList.add('hidden');
        document.querySelector('.history_sidebar').classList.add('hidden');
    }
};

const voidListShifter = () => {
    let container = document.querySelector('.container');
    if (savedGifs.length > 0 || layout != 'personal_list' ) {
        container.classList.remove('void_list');
    } else {
        container.classList.add('void_list');
    }
};


/**
 * render_PersonalList
 */
const render_PersonalList = () => {
    let picturesBlock = document.querySelector('.gallery_items');
    picturesBlock.innerHTML = savedGifs.reduce((acc, savedGif) => acc + `     
        <div class = "gallery_item">
            <div class="gallery_item_content">
                <div class="gallery_picture">
                    <img
                    src="${savedGif.src}" 
                    alt="${savedGif.title}"
                    width = "${savedGif.width}"
                    height = "${savedGif.height}"
                    >
                </div>
                <div class="gallery_info">
                    <h4>${savedGif.title}</h4>
                    <div class="author">${savedGif.author}</div>
                </div>
                <div class="gallery_buttons">
                    <div class="gallery_button save_picture">
                        <span class="fa fa-save"></span>
                    </div>
                    <div class="gallery_button remove_picture">
                        <span class="fa fa-trash"></span>
                    </div>
                </div>
            </div>
        </div>       
     `, '');
};


/**
 * render_SearchList
 */
const render_SearchList = () =>{
    let picturesBlock = document.querySelector('.gallery_items');
    picturesBlock.innerHTML = gifs.reduce((acc, gif) => acc +
    `
        <div class = "gallery_item">
            <div class="gallery_item_content">
                <div class="gallery_picture">
                    <img
                     src="${gif.images.original.url}" 
                     alt="${gif.title}"
                     width = "${gif.images.original.width}"
                     height = "${gif.images.original.height}"
                     >
                </div>
                <div class="gallery_info">
                    <h4>${gif.title}</h4>
                    <div class="author">${gif.username}</div>
                </div>
                <div class="gallery_buttons">
                    <div class="gallery_button save_picture">
                        <span class="fa fa-save"></span>
                    </div>
                    <div class="gallery_button remove_picture">
                        <span class="fa fa-trash"></span>
                    </div>
                </div>
            </div>
        </div>
    `
, '');
};


/**
 * renderSearches
 */
const renderSearches = () =>{

    let sidebar = document.querySelector('.history_info_text');
    sidebar.innerHTML = savedSearches.reduce((acc, history) => acc +
    `
    <div class = info_search>
        <h4>${history.time}</h4>
        <h5>${history.text}</h5>
    </div>
    `
, '');
    
}

/**
 * Render
 */
const render = () => {

        if(layout == 'personal_list'){  
            render_PersonalList();
                    
        }

        if(layout == 'search_list'){
            render_SearchList();
    }

    voidListShifter();
    gridCreator();
    initEvents();
};




/**
 * Alert
 */
const launchAlert = (type, message = '')  => {
    let container = document.querySelector('.container');
    let alert = document.querySelector('.alert');

    container.classList.remove('show_alert_info');
    container.classList.remove('show_alert_danger');

   void container.offsetWidth //hack error navegador animaciones css

   alert.innerText = message;

   if (type == 'info') {
       container.classList.add('show_alert_info');
       
   }  
   if (type == 'danger') {
       container.classList.add('show_alert_danger');
   }


};

/**
 * INIT
 */
window.addEventListener('load', () => {
    loadWelcomeMessage();
    popUp_welcome();
    initGlobalEvents();
    loadSavedGifs();
    loadSavedSearches();
    render();
    
});

