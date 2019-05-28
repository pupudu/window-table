/* eslint-disable */
import React from "react";

const shinobi = [
  { name: 'Naruto', age: 24, clan: 'Uzomaki', avatar: 'https://media1.giphy.com/media/A8KKbVZwr4wOk/giphy.gif' },
  { name: 'Hinata', age: 22, clan: 'Hyuga', avatar: 'https://media.giphy.com/media/bEWpI12th8pTq/giphy.gif' },
  { name: 'Neji', age: 24, clan: 'Hyuga', avatar: 'https://66.media.tumblr.com/f4016a3c39e5fcdb3da631f39f3fa4ad/tumblr_ou3kkhFF2i1rqe0rbo1_r1_400.gif' },
  { name: 'Asuma', age: 36, clan: 'Sarutobi', avatar: 'https://vignette.wikia.nocookie.net/xianb/images/7/7c/Asuma.png/revision/latest?cb=20150728072352' },
  { name: 'Kakshi', age: 38, clan: 'Hatake', avatar: 'https://thumbs.gfycat.com/MedicalBriefEyra-small.gif' },
  { name: 'Hashirama', age: 108, clan: 'Senju', avatar: 'https://i.pinimg.com/originals/a2/84/f5/a284f5a70aa8c8f6cd9890fd78ab6e39.png' },
  { name: 'Tobirama', age: 106, clan: 'Senju', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/b/be/Tobirama_Senju.png/revision/latest?cb=20160115192559' },
  { name: 'Sasuke', age: 24, clan: 'Uchiha', avatar: 'https://media2.giphy.com/media/e4NbcUXXsmFwI/giphy.gif' },
  { name: 'Sakura', age: 22, clan: 'Haruno', avatar: 'https://pbs.twimg.com/profile_images/770043445343821826/Kua_1lzX.jpg' },
  { name: 'Minato', age: 46, clan: 'Namikaze', avatar: 'https://media2.giphy.com/media/2EvQkonlY9jS8/giphy.gif' },
  { name: 'Tsunade', age: 76, clan: 'Senju', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/e/e6/Tsunade_Infobox.png/revision/latest?cb=20180316171919' },
  { name: 'Obito', age: 36, clan: 'Uchiha', avatar: 'https://media1.tenor.com/images/ac16b484b32888c1884c26a688f56809/tenor.gif?itemid=11475474' },
  { name: 'Hidan', age: 2000, clan: 'Unknown', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/6/6e/Hidan2.png/revision/latest?cb=20160110022947' },
  { name: 'Kakusu', age: 45, clan: 'Unknown', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/5/53/Kakuzu_mugshot.png/revision/latest?cb=20160115192126' },
  { name: 'Deidara', age: 35, clan: 'Unknown', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/d/d3/Deidara_mugshot.png/revision/latest?cb=20160113165515' },
  { name: 'Might Guy', age: 36, clan: 'Unknown', avatar: 'https://media1.tenor.com/images/6a3050d5502981c1acf4ea206dda9f0a/tenor.gif?itemid=7248440' },
  { name: 'Might Dai', age: 56, clan: 'Unknown', avatar: 'https://vignette.wikia.nocookie.net/naruto/images/b/b7/Might_Duy.png/revision/latest?cb=20150702114443' },
  { name: 'Itachi', age: 28, clan: 'Uchiha', avatar: 'https://data.whicdn.com/images/319035705/original.gif' }
  //...and thousands or millions of data
];
/* eslint-enable */

export const getData = (limit = 100000) => {
  const repeatingShinobi = [];
  for (let i = 0; i < limit; i++) {
    const index = Math.floor(Math.random() * shinobi.length);
    repeatingShinobi.push({
      id: i,
      ...shinobi[index]
    });
  }
  return repeatingShinobi;
};
export const data = getData();

const Avatar = ({ row, column }) => {
  return (
    <img
      src={row[column.key]}
      alt="avatar"
      style={{
        height: '40px'
      }}
    />
  );
};

export const columns = [
  { key: 'id', width: 25, title: 'Index' },
  { key: 'avatar', width: 40, title: 'Avatar', Component: Avatar },
  { key: 'name', width: 100, title: 'Name' },
  { key: 'clan', width: 100, title: 'Clan' },
  { key: 'age', width: 40, title: 'Age' }
];
