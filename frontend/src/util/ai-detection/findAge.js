// For Age detection model
// data from fetching Clarifai API response
const findAge = (data) => {
    const clarifaiAges = data.outputs[0].data.concepts;
    console.log('\nfindAge(data) - Ages:\n', clarifaiAges);

    return clarifaiAges.map(each_age => {
      return {
        age: each_age
      };
    });
};

export default findAge;