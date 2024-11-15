// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';

// const EmbedPreview = ({ url }) => {
//   const [ogp, setOgp] = useState(null);

//   useEffect(() => {
//     const fetchOgpData = async () => {
//       try {
//         const response = await axios.get(`/api/embed?url=${encodeURIComponent(url)}`);
//         setOgp(response.data);
//       } catch (error) {
//         console.error('Failed to fetch OGP data', error);
//       }
//     };

//     fetchOgpData();
//   }, [url]);

//   if (!ogp) return <p>Loading...</p>;

//   return (
//     <div className="embed">
//       <div className="body">
//         <div className="title">
//           <a href={url} target="_blank" rel="noopener noreferrer">
//             {ogp.title}
//           </a>
//         </div>
//         <div className="description">{ogp.description}</div>
//       </div>
//       {ogp.image && (
//         <div className="image">
//           <img src={ogp.image} alt={ogp.title} />
//         </div>
//       )}
//       {ogp.embedHtml && (
//         <div className="embed-html" dangerouslySetInnerHTML={{ __html: ogp.embedHtml }} />
//       )}
//     </div>
//   );
// };

// EmbedPreview.propTypes = {
//   url: PropTypes.string.isRequired,
// };

// export default EmbedPreview;
