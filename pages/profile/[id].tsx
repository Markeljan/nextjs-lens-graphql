import { useRouter } from "next/router";
import { client, getProfile, getPublications } from "../../api";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function Profile() {
  const [profile, setProfile] = useState();
  const [pubs, setPubs] = useState();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchProfile();
      getPubs();
    }
  }, [id]);

  if (!profile) {
    return null;
  }

  async function fetchProfile() {
    try {
      const response = await client.query(getProfile, { id }).toPromise();
      console.log("response: ", response);
      setProfile(response.data.profile);
    } catch (err) {
      console.log(err);
    }
  }

  async function getPubs() {
    try {
      const response = await client.query(getPublications, { id }).toPromise();
      console.log("pubs res: ", response);
      setPubs(response.data.publications.items);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      {profile.picture ? (
        <div>
          <Image
            src={profile.picture.original.url}
            alt="profile image"
            width="200px"
            height="200px"
          />
        </div>
      ) : (
        <div
          style={{ width: "200px", height: "200px", backgroundColor: "black" }}
        ></div>
      )}
      <div>
        <h4>{profile.handle}</h4>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
        <p>{profile.bio}</p>
      </div>
      <div>
        {pubs &&
          pubs.map((pub) => (
            <div
              key={pub.id}
              style={{ padding: "20px", borderTop: "1px solid black" }}
            >
              <br />
              <small>{pub.createdAt.substring(0, 10)}</small>
              <p>{pub.metadata.content}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
