import { createApi } from "unsplash-js"

const unsplash = createApi({
    accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getUrlForCoffeeStores = (latLong, query, limit, sort) => {
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&sort=${sort}&limit=${limit}`;
};

const getListOfCoffeeStoresPhotos = async () => {
    const photos = await unsplash.search.getPhotos({
        query: 'London coffee shop',
        page: 1,
        perPage: 30,
    });
    const unsplashResults = photos.response.results;
    
    return unsplashResults.map(
        (result) => result.urls["small"]
    );
}

export const fetchCoffeeStores = async (
    latLong = "51.510048996948726,-0.13438138603799668",
    limit = 6
) => {
    const photos = await getListOfCoffeeStoresPhotos();

    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
        }
      };
      
      const response = await fetch(
            getUrlForCoffeeStores(
                latLong, "coffee", 
                limit, 
                "RELEVANCE"
            ), options
        );
      const data = await response.json();
      return data.results.map((result, index) => {
        return  {
            id: result.fsq_id,
            name: result.name,
            address: result.location.address,
            neighbourhood: result.location.region,
            imgUrl: photos[index],
        };
      });
}