// import React from "react";

// const PomsSection2 = () => {
//   return (
//     <div className="flex flex-col justify-center h-full w-full gap-2">
//       <div className="flex justify-center w-full gap-2">
//         <div
//           className="px-4 py-1 flex flex-col justify-end rounded-md h-full min-h-[40vh] shadow-lg w-full min-w-[40%] ml-4"
//           style={{
//             backgroundImage:
//               "url('https://cdn.imweb.me/thumbnail/20240212/16af7f20daf7a.png')",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <h2 className="text-2xl font-bold max-sm:text-sm">White Paper</h2>
//           <p className="text-lg max-sm:text-sm">
//             Check out the white paper here
//           </p>
//         </div>
//         <div
//           className="px-4 py-1 flex flex-col justify-end rounded-md shadow-lg w-full min-w-[40%] h-full min-h-[40vh]"
//           style={{
//             backgroundImage:
//               "url('https://cdn.imweb.me/thumbnail/20240212/3e198e1b7663c.png')",
//             backgroundPosition: "center",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <h2 className="text-2xl font-bold mb-4 max-sm:text-sm">
//             Security Audit
//           </h2>
//           <p className="text-lg max-sm:text-sm">Check it out here.</p>
//         </div>
//       </div>
//       <div className="flex justify-center w-full">
//         <div
//           className="px-4 py-1 flex flex-col justify-end rounded-md shadow-lg w-3/4 h-full min-h-[60vh]"
//           style={{
//             backgroundImage:
//               "url('https://cdn.imweb.me/thumbnail/20240212/d87978c798889.png')",
//             backgroundSize: "cover",
//             backgroundRepeat: "no-repeat",
//           }}
//         >
//           <h2 className="text-2xl font-bold max-sm:text-sm">
//             Universe3 is one of the most active communities in the
//             cryptocurrency industry. Our dog-loving global community supports
//             cryptocurrency and our mission to adopt animals. Get Universe3
//             through Unviverse3 Swap
//           </h2>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PomsSection2;

import React, { useState, useEffect } from "react";

const PomsSection2 = () => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const largeScreenStyle = {
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="flex flex-col justify-center h-full w-full gap-2">
      <div className="flex justify-center w-full gap-2">
        <div
          className={`px-4 py-1 flex flex-col justify-end rounded-md h-full shadow-lg w-full min-w-[40%] ml-4 ${
            isLargeScreen ? "min-h-[40vh]" : "min-h-[25vh]"
          }`}
          style={{
            backgroundImage: isLargeScreen
              ? "url('https://cdn.imweb.me/thumbnail/20240212/16af7f20daf7a.png')"
              : "none",
            ...(isLargeScreen ? largeScreenStyle : {}),
          }}
        >
          <h2 className="text-2xl font-bold max-sm:text-sm">White Paper</h2>
          <p className="text-lg max-sm:text-sm">
            Check out the white paper here
          </p>
        </div>
        <div
          className={`px-4 py-1 flex flex-col justify-end rounded-md h-full shadow-lg w-full min-w-[40%] ml-4 ${
            isLargeScreen ? "min-h-[40vh]" : "min-h-[25vh]"
          }`}
          style={{
            backgroundImage: isLargeScreen
              ? "url('https://cdn.imweb.me/thumbnail/20240212/3e198e1b7663c.png')"
              : "none",
            ...(isLargeScreen ? largeScreenStyle : {}),
          }}
        >
          <h2 className="text-2xl font-bold mb-4 max-sm:text-sm">
            Security Audit
          </h2>
          <p className="text-lg max-sm:text-sm">Check it out here.</p>
        </div>
      </div>
      <div className="flex justify-center w-full">
        <div
          className={`px-4 py-1 flex flex-col justify-end rounded-md h-full shadow-lg w-full min-w-[40%] ml-4 ${
            isLargeScreen ? "min-h-[70vh]" : "min-h-[25vh]"
          }`}
          style={{
            backgroundImage: isLargeScreen
              ? "url('https://cdn.imweb.me/thumbnail/20240212/d87978c798889.png')"
              : "none",
            ...(isLargeScreen ? largeScreenStyle : {}),
          }}
        >
          <h2 className="text-2xl font-bold max-sm:text-sm">
            Universe3 is one of the most active communities in the
            cryptocurrency industry. Our dog-loving global community supports
            cryptocurrency and our mission to adopt animals. Get Universe3
            through Unviverse3 Swap
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PomsSection2;
