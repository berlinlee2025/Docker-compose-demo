// For Color detection model
// data from fetching Clarifai API response
const findColor = (data) => {
    const clarifaiColors = data.outputs[0].data.colors;
    console.log('\ndata - Colors:\n', clarifaiColors);

    return clarifaiColors.map(color => {
      return {
        colors: color
      };
    });
};

export default findColor;