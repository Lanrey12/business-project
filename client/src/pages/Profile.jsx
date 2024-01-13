import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserSuccess,
  deleteUserFailure,
  initialDeleteUser,
  initialUpdateUser,
  updateUserSuccess,
  updateUserFailure,
  initialSignOut,
  signOutFailure,
  signOutSuccess,
} from "../redux/user/userSlice";

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([])

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(initialUpdateUser());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(initialDeleteUser());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(initialSignOut());
      const response = await fetch("/api/auth/signout");
      const data = await response.json();
      if (data.success === false) {
        dispatch(signOutFailure(data.message));
        return;
      }
      dispatch(signOutSuccess(data));
      navigate("/signin");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    // the line below is to make the file name unique as you might have a repeat upload of the same image
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true, error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, avatar: downloadUrl });
        });
      }
    );
  };

  const handleShowListings = async () => {
    try {
      setShowListingError(false)
      const responseData = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await responseData.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListings(data)
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const responseData = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await responseData.json()
      if (data.success === false) {
        console.log(data.message)
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId))
    }catch (error){
      console.log(error.message)
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              {" "}
              Image upload unsuccessful / image must be less than 2 mb{" "}
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">
              {`Uploading ${filePercentage}`}
            </span>
          ) : filePercentage === 100 ? (
            <span className="text-green-700">Image upload Successful!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="username"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
          defaultValue={currentUser.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "loading..." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer"
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "Profile updated successfully" : ""}
      </p>
      <button onClick={handleShowListings} className="w-full text-green-700">
        Show Listings
      </button>
      <p className="text-red-700 mt-5">
        {showListingsError ? "Error showing listings" : ""}
      </p>
      {userListings && 
      userListings.length > 0 && 
      <div className="flex flex-col gap-4">
        <h1 className=" text-center my-7 text-2xl font-semibold">Your Listings</h1>
      {userListings.map((listing) => 
        (
          <div className="border p-3 flex justify-between items-center rounded-lg gap-4" key={listing._id}>
            <Link to={`/listing/${listing._id}`}>
              <img src={listing.imageUrls[0]} alt="listing image" className="h-16 w-16 object-contain rounded-lg"/>
            </Link>
            <Link className="text-slate-700 font-semibold hover:underline truncate flex-1" to={`/listing/${listing._id}`}>
              <p>{listing.name}</p>
            </Link>

            <div className="flex flex-col item-center">
              <button type="button" onClick={() => handleDeleteListing(listing._id)} className="text-red-700 uppercase">
                Delete
              </button>
              <button className="text-green-700 uppercase">
                Edit
              </button>
            </div>
          </div>
        ))}
        </div>}
    </div>
  );
}
