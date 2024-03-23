import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(offerListings);

  useEffect(() => {
    {
      const fetchOfferListings = async () => {
        try {
          const responseData = await fetch(
            "/api/listing/get?offer=true&limit=4"
          );
          const data = await responseData.json();
          setOfferListings(data);
          fetchRentListings();
        } catch (error) {
          console.log(error);
        }
      };

      const fetchRentListings = async () => {
        try {
          const responseData = await fetch(
            "/api/listing/get?type=rent&limit=4"
          );
          const data = await responseData.json();
          setRentListings(data);
          fetchSaleListings();
        } catch (error) {
          console.log(error);
        }
      };

      const fetchSaleListings = async () => {
        try {
          const responseData = await fetch(
            "/api/listing/get?type=sale&limit=4"
          );
          const data = await responseData.json();
          setSaleListings(data);
        } catch (error) {
          console.log(error);
        }
      };

      fetchOfferListings();
    }
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <div className="text-slate-700 font-bold text-3xl lg:text-6xl">
          <h1>
            Find your next <span className="text-slate-500">perfect</span>
            <br />
            car with ease
          </h1>
          <div className="text-gray-400 text-xs sm:text-sm">
            Mazda can be summed up in a single word: bold. Not only do its cars
            generally look like nothing else on the market, but it’s also
            invested heavily in innovative engine technology.
            <br />
            So, while many car makers have moved to smaller turbocharged
            engines, Mazda instead offers larger motors that are still
            efficient.
            <br /> For example, the entry-level petrol option in the Mazda 3 is
            a 2.0-litre unit – far larger than what you’ll find in most rivals –
            but it remains very clean.
          </div>
          <Link
            className="text-xs sm:text-sm text-blue-800 hover:underline font-bold"
            to={"/search"}
          >
            Let's get started...
          </Link>
        </div>
        </div>

     
          {" "}
          <Swiper navigation>
            {offerListings &&
              offerListings.length > 0 &&
              offerListings.map((listing) => (
                <SwiperSlide key={listing.id}>
                  <div
                    style={{
                      background: `url(${listing.imageUrls[0]}) center no-repeat`,
                      backgroundSize: "cover",
                      height: "600px",
                    }}
                    className="h-[500px]"
                    key={listing.id}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
        
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap=8 my-10">
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent offers</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?offer=true'}>Show more offers</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    offerListings.map((listing) => (
                      <ListingItem listing={listing} key={listing.id} />
                    ))
                  }
                </div>
              </div>
          )}
           {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for rent</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=true'}>Show more places to rent</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    rentListings.map((listing) => (
                      <ListingItem listing={listing} key={listing.id} />
                    ))
                  }
                </div>
              </div>
          )}
           {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="my-3">
                <h2 className="text-2xl font-semibold text-slate-600">Recent places for sale</h2>
                <Link className="text-sm text-blue-800 hover:underline" to={'/search?type=true'}>Show more places for sale</Link>
                </div>
                <div className="flex flex-wrap gap-4">
                  {
                    saleListings.map((listing) => (
                      <ListingItem listing={listing} key={listing.id} />
                    ))
                  }
                </div>
              </div>
          )}
        </div>
      </div>
    );
}
