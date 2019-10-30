var appSettings = getObjectFromLocalStorage('appSettings') ? getObjectFromLocalStorage('appSettings') : {enableAdvert: false, advertFiles: []};
var orders = getObjectFromLocalStorage('orders').length ? getObjectFromLocalStorage('orders') : [];

var processingOrdersList = document.getElementById('processingOrders');
var readyOrdersList = document.getElementById('readyOrders');
var advertImageEl = document.getElementById('advertImageEl');
let advertImageIndex = 0;

var processingOrdersListFragment = document.createDocumentFragment();
var readyOrdersListFragment = document.createDocumentFragment();

/**
 * Рендерим внешний вид записи о заказе
 * @param order
 * @returns {HTMLElement}
 */
function renderOrder(order) {
    var orderRecord = document.createElement("div");
    orderRecord.className="order";
    orderRecord.innerHTML = '<p>' + order.orderNumber + '</p>';

    if (order.isLastReady && order.status === 'ready') {
        orderRecord.classList.add('last-ready')
    }

    return orderRecord;
}

/**
 * Генерируем в html списки заказов ("готовятся" и "готовы")
 */
function generateOrderLists() {
    let processingResult = [];
    let readyResult = [];
    processingOrdersList.innerHTML = '';
    readyOrdersList.innerHTML = '';

    if (getObjectFromLocalStorage('orders')) {
        getObjectFromLocalStorage('orders').forEach((order) => {

            if (order.status === 'processing') {
                processingResult.push(renderOrder(order));
            } else if (order.status === 'ready') {
                readyResult.push(renderOrder(order));
            }

        });
    }

    for(var i = 0; i < processingResult.length; i++) {
        processingOrdersListFragment.appendChild(processingResult[i]);
    }
    for(var i = 0; i < readyResult.length; i++) {
        readyOrdersListFragment.appendChild(readyResult[i]);
    }

    processingOrdersList.appendChild(processingOrdersListFragment);
    readyOrdersList.appendChild(readyOrdersListFragment);

    reverseChildNodes(processingOrdersList);
    reverseChildNodes(readyOrdersList);
}

/**
 * Определяем, показывать ли рекламный блок в табло
 */
function enableAdvertContainer() {
    if (appSettings.enableAdvert && appSettings.advertFiles.length) {

        // Показываем рекламный блок
        document.body.classList.add('enable-advert');

        // Показываем изображение в рекламном блоке
        changeAdvertImage(appSettings.advertFiles);
    } else {

        // Скрываем рекламный блок
        document.body.classList.remove('enable-advert');
    }
}

/**
 * Подменяем путь у изображения id="advertImageEl" итеративно
 * из массива advertFiles
 * @param advertFiles
 */
function changeAdvertImage(advertFiles) {
    advertImageEl.src = advertFiles[advertImageIndex++ % advertFiles.length];
}

/**
 * Обновление данных приложения раз в секунду:
 * - списков заказов "готовятся" и "готовы"
 * - настроек приложения (отображения рекламного блока и тп)
 */

function refreshAppData() {
    window.addEventListener('storage', function (e) {

        if (e.key === 'orders' && e.newValue !== e.oldValue) {
            // Обновление списков заказов
            generateOrderLists();
        }

        if (e.key === 'appSettings' && e.newValue !== e.oldValue) {
            // Обновление настроек приложения
            appSettings = getObjectFromLocalStorage('appSettings');
            enableAdvertContainer();

            // Если в панели выбраны файлы для показа,
            // обновляем их в рекламном блоке
            if (appSettings.advertFiles && appSettings.advertFiles.length) {
                changeAdvertImage(appSettings.advertFiles);
            }
        }
    });

    // Обновляем изображения в рекламном блоке каждые 15 секунд
    if (appSettings.advertFiles && appSettings.advertFiles.length) {
        setInterval(() => {
            changeAdvertImage(appSettings.advertFiles);
        }, 15000);
    }
}

generateOrderLists();
enableAdvertContainer();
refreshAppData();
