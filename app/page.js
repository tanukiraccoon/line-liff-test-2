"use client";
import { useEffect, useState } from "react";
import { useLIFF } from "../providers/liff-providers";
import styles from "./page.module.css";

export default function Home() {
  const { liff, liffError } = useLIFF();
  const [profile, setProfile] = useState(null);

  // when liff is ready, fetch profile
  useEffect(() => {
  if (!liff) return;

  const fetchProfile = async () => {
    try {
      const p = await liff.getProfile();
      setProfile(p);
    } catch (err) {
      console.error("Failed to get profile:", err);
    }
  };

  fetchProfile();
}, [liff]);
  
  return (
    <div>
      <main className={styles.main}>
        <h1>create-liff-app</h1>
        {liff && <p>LIFF init succeeded.</p>}
        {profile && (
          <div>
            <h2>Profile</h2>
            <p>userId: {profile.userId}</p>
            <p>displayName: {profile.displayName}</p>
            {profile.pictureUrl && (
              <img src={profile.pictureUrl} alt="profile" width={80} height={80} />
            )}
          </div>
        )}
        {liffError && (
          <>
            <p>LIFF init failed.</p>
            <p>
              <code>{liffError}</code>
            </p>
          </>
        )}
        <a
          href="https://developers.line.biz/ja/docs/liff/"
          target="_blank"
          rel="noreferrer"
        >
          LIFF Documentation
        </a>
      </main>
    </div>
  );
}
