/**
 * Сохраняем данные о заказах в LocalStorage
 */
function setOrdersToLocalStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

/**
 * Сохраняем данные о настройках приложения в LocalStorage
 */
function setAppSettingsToLocalStorage(settings) {
    localStorage.setItem('appSettings', JSON.stringify(settings));
}

/**
 * Возвращает объект из localStorage
 * @param objectName
 * @returns {any}
 */
function getObjectFromLocalStorage(objectName) {
    return JSON.parse(localStorage.getItem(objectName));
}

/**
 * Сортируем по убыванию заказы в списках
 * @param node
 * @returns {*}
 */
function reverseChildNodes(node) {
    var parentNode = node.parentNode, nextSibling = node.nextSibling,
        frag = node.ownerDocument.createDocumentFragment();
    parentNode.removeChild(node);
    while(node.lastChild)
        frag.appendChild(node.lastChild);
    node.appendChild(frag);
    parentNode.insertBefore(node, nextSibling);
    return node;
}
