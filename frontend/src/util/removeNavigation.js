const removeNavigation = () => {
    const navigationElement = document.querySelector('#navigation');

    if (navigationElement) {
        navigationElement.remove();
    }
}

export { removeNavigation };