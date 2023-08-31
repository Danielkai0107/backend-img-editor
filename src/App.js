import React, { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL, list, deleteObject } from "firebase/storage";
import { storage } from './lib/firebase';


function App() {
  const [images, setImages] = useState([]);
  const [searchedImages, setSearchedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedImageUrl, setSearchedImageUrl] = useState("");
  const [imageUrls, setImageUrls] = useState({}); 

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    const imagesRef = ref(storage, 'images');
    const res = await list(imagesRef);
    const urls = {};
    for (let imageRef of res.items) {
      urls[imageRef.name] = await getDownloadURL(imageRef);
    }
    setImageUrls(urls);
    setImages(res.items);
  };
  

  //點擊開始搜尋
  const handleSearch = () => {
    setSearchedImageUrl(false); 
    const results = images.filter(imageRef => imageRef.name.includes(searchTerm));
    setSearchedImages(results);
  };
  //上傳圖片至資料庫
  const handleUpload = async (event, replace = false) => {
    const file = event.target.files[0];
    if (file) {
      const storageRef = replace && selectedImage ? selectedImage : ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        () => {}, 
        (error) => {
          console.error(error);
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            fetchImages();  // Refresh the list after upload
          });
        }
      );
    }
  };
  //圖片清單選取預覽
  const handleImageSelect = (imageRef) => {
    setSelectedImage(imageRef);
  };
  

  //刪除圖片
  const handleDelete = async () => {
    if (selectedImage) {
      await deleteObject(selectedImage);
      setSelectedImage(null);
      fetchImages();  // Refresh the list after delete
    }
  };
  //搜尋圖片點選預覽
  const handleSearchImageSelect = async (imageRef) => {
    const url = await getDownloadURL(imageRef);
    setSearchedImageUrl(url);
  };
  //取消選取
  const handleCancelSelect = () => {
    setSelectedImage(null)
  };


  return (
    <>
    <h1>Images DataBase</h1>
    <article>
      <button onClick={handleCancelSelect}>Cancel</button>
      <h3>Upload Image</h3>
      {/* Upload image */}
      <input type="file" onChange={(e) => handleUpload(e, false)} />
      <button onClick={handleDelete}>Delete Selected Image</button>
      {selectedImage && (
        <section>
          <h3>Replace Image</h3>
          <input type="file" onChange={(e) => handleUpload(e, true)} />
        </section>
      )}

      {/* Display image */}
      <section>
        <h3>Images List</h3>
        <ul>
          {images.map((imageRef, index) => (
            <li className='target' key={index} onClick={() => handleImageSelect(imageRef)} style={{cursor: 'pointer'}}>
              {imageRef.name}
              {imageUrls[imageRef.name] && <img src={imageUrls[imageRef.name]} alt={imageRef.name} style={{width: '40px', height: 'auto'}} />}
            </li>
          ))}
          {selectedImage && (
            <img src={imageUrls[selectedImage.name]} alt="Selected from Firebase" style={{width: '90px', height: 'auto'}} />
          )}
        </ul>
      </section>

      {/* Display Search Results */}
      <h3>Search Results</h3>
      <section>
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." />
        <button onClick={handleSearch}>Search</button>
      </section>

      <section>
        {searchedImages.length === 0 ? (
          <p>No results</p>
        ) : (
          <ul>
            {searchedImages.map((imageRef, index) => (
            <li key={index} onClick={() => handleSearchImageSelect(imageRef)} style={{cursor: 'pointer'}}>
              {imageRef.name}
            </li>))}
          </ul>
        )}
      </section>
      {searchedImageUrl && <img src={searchedImageUrl} alt="Searched from Firebase" style={{width: '90px', height: 'auto'}} />}
    </article>
    </>
  );
}

export default App;
