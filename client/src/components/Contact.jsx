import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [listingOwner, setOwnerListing] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchListingOwner = async () => {
      try {
        const responseData = await fetch(`/api/user/${listing.userRef}`);
        const data = await responseData.json();
        setOwnerListing(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListingOwner();
  }, [listing.userRef]);
  return (
    <>
      {listingOwner && (
        <div className="flex flex-col gap-2">
          <p>
            Contact{" "}
            <span className="font-semibold">{listingOwner.username}</span> for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
            to={`mailto:${listingOwner.email}?subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
