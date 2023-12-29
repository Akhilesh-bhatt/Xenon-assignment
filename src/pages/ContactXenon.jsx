import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import Spinner from "../components/Spinner";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";

function Contact() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        contact: 0,
        message: "",
        images: {}
      });
      const {
        firstName,
        lastName,
        email,
        contact,
        message,
        images
      } = formData;

  const isMounted = useRef(true);
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isMounted) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData({ ...formData, userRef: user.uid });
        } else {
          navigate("/signin");
          toast.error("You have to first Sign In !!");
        }
      });
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 6) {
      setLoading(false);
      toast.error("Maximum 6 files can be uploaded");
      return;
    }

    //store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, "image/" + fileName);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            reject(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    };

    const imageUrls = await Promise.all(
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Files not uploaded!");
    });

    const formDataCopy = {
      ...formData,
      imageUrls,
      timestamp: serverTimestamp(),
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, "contact"), formDataCopy);
    setLoading(false);
    toast.success("Form Submitted!!");
    navigate(`/offer`);
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="pageContainerNew">
      <header>
        <p className="pageHeader">Contact Us</p>
      </header>
        <main>
          <form className="messageFormNew" onSubmit={onSubmit}>
            <div className="flex">
                <div style={{marginRight: "0.5rem"}}>
                    <label className="formLabel ">First Name</label>
                    <input
                        className="formInputNameNew"
                        type="text"
                        id="firstName"
                        value={firstName}
                        onChange={onMutate}
                        maxLength="32"
                        minLength="10"
                        required
                    />
                </div>

                <div style={{marginLeft: "0.5rem"}}>
                    <label className="formLabel">Last Name</label>
                    <input
                        className="formInputNameNew"
                        type="text"
                        id="lastName"
                        value={lastName}
                        onChange={onMutate}
                        maxLength="32"
                        minLength="10"
                        required
                    />
                </div>
            </div>

            <label className="formLabel">Email</label>
            <input
                className="formInputNameNew"
                type="email"
                id="email"
                value={email}
                onChange={onMutate}
                maxLength="32"
                minLength="10"
                required
            />

            <label className="formLabel">Contact Number</label>
            <input
                className="formInputNameNew"
                type="number"
                id="contact"
                value={contact}
                onChange={onMutate}
                maxLength="32"
                minLength="10"
                required
            />
                
            <div>
                <label className="formLabel">Your Concern/Query</label>
                <textarea
                    name="message"
                    id="message"
                    className="formInputNameNew"
                    value={message}
                    onChange={onMutate}
                    required
                ></textarea>
            </div>
            

            <label className="formLabel">Upload Documents</label>
            <p className="imagesInfo">
           Provide images relevant to your concern ( .jpg, .jpeg, and .png file formats)
            </p>
            <input
                className="formInputFileNew"
                type="file"
                id="images"
                onChange={onMutate}
                max="6"
                accept=".jpg,.png,.jpeg"
                multiple
            />

          <button type="submit" className="sendMessage createListingButton">
            Send Message
          </button>
              
          </form>
        </main>
    </div>
  );
}

export default Contact;