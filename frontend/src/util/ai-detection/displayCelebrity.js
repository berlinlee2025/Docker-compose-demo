// For Celebrity detection model
const displayCelebrity = (component, celebrity) => {
    component.setState({ celebrity: celebrity }, () => {
        console.log('\nCelebrity object: \n', celebrity)
    });
};

export default displayCelebrity;