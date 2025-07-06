import { useEffect, useState } from "react";
import { auth, db, storage } from "../firebaseConfig";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

const ProgressBar = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-600 h-4 rounded-full transition-all"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);

const NursingEduCenter = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadedList, setUploadedList] = useState([]);
  const [progress, setProgress] = useState({ downloads: 0, videos: 0, quizzes: 0 });

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
      setIsLoggedIn(true);
      await setDoc(doc(db, "users", userCred.user.uid), { downloads: 0, videos: 0, quizzes: 0 });
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCred.user);
      setIsLoggedIn(true);
      const docSnap = await getDoc(doc(db, "users", userCred.user.uid));
      if (docSnap.exists()) setProgress(docSnap.data());
    } catch (error) {
      alert(error.message);
    }
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploadFiles(files);
    for (let file of files) {
      const storageRef = ref(storage, `uploads/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
    }
    loadUploads();
    updateProgress("downloads");
  };

  const loadUploads = async () => {
    const listRef = ref(storage, `uploads/${user.uid}`);
    const result = await listAll(listRef);
    const urls = await Promise.all(result.items.map((item) => getDownloadURL(item)));
    setUploadedList(urls);
  };

  const updateProgress = async (type) => {
    const updated = { ...progress, [type]: progress[type] + 20 };
    setProgress(updated);
    await setDoc(doc(db, "users", user.uid), updated);
  };

  return (
    <div className="p-4">
      {!isLoggedIn ? (
        <div>
          <input
            className="border p-2 m-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="border p-2 m-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-green-500 text-white px-4 py-2 m-2" onClick={handleLogin}>Login</button>
          <button className="bg-yellow-500 text-white px-4 py-2 m-2" onClick={handleRegister}>Register</button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-green-700 mb-4">📊 My Progress</h2>
          <ProgressBar label="Handouts Downloaded" value={progress.downloads} />
          <ProgressBar label="Videos Watched" value={progress.videos} />
          <ProgressBar label="Quizzes Completed" value={progress.quizzes} />

          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800">Upload Notes</h3>
            <input type="file" multiple onChange={handleUpload} className="mt-2" />
            <ul className="list-disc pl-5 mt-4">
              {uploadedList.map((url, index) => (
                <li key={index}>
                  <a href={url} target="_blank" className="text-blue-600 underline" rel="noreferrer">
                    {url.split("/").pop().split("?")[0]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NursingEduCenter;
