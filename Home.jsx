import { useNavigate } from "react-router-dom";
import { FaInstagram, FaLinkedin, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useEffect } from "react";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <div className="bg-gradient-to-br from-green-50 to-white">
      {/* Hero Section */}
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(/image.jpg)` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-extrabold text-white mb-6"
          >
            Welcome to GreenBytes
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          >
            Join us in our mission to promote sustainable e-waste recycling and protect the planet for future generations.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-green-500 to-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Get Started
          </motion.button>
        </div>
      </div>

      {/* Content Cards Section */}
      <motion.div className="py-20 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Recycling e-waste reduces pollution and helps recover valuable materials that can be reused for new technologies.",
              "Proper recycling ensures harmful chemicals like lead and mercury do not contaminate the environment.",
              "Join us in our mission to protect the planet. Recycle responsibly!",
            ].map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ amount: 0.3 }}
                className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <p className="text-lg text-gray-600">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="text-4xl font-extrabold text-center text-gray-800 mb-12"
          >
            Meet Our Team
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { name: "Om Patel", img: "/om.jpg" },
              { name: "Deep Patel", img: "/deep.jpg" },
              { name: "Jaydeep Patel", img: "/jaydeep.jpg" },
              { name: "Drashti Patel", img: "/drashti.jpg" },
              { name: "Priya Sisodiya", img: "/priya1.jpg" },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ amount: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={member.img}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-green-500"
                />
                <h3 className="text-xl font-semibold text-center text-gray-800">{member.name}</h3>
                <p className="text-center text-gray-600">B.Tech. (CSE) Final Year</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.div className="py-20 bg-gradient-to-br from-white to-green-50">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="text-4xl font-extrabold text-center text-gray-800 mb-12"
          >
            Our Vision
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:shadow-2xl transition-all duration-300"
          >
            <p className="text-lg text-gray-600 mb-4">
              At GreenBytes, our vision is to promote sustainable e-waste recycling, reducing environmental impact and creating a circular economy.
            </p>
            <p className="text-lg text-gray-600">
              We aim to ensure that every electronic device is responsibly recycled to conserve resources and protect communities.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Contact Us Section */}
      <motion.div className="py-20 bg-gradient-to-br from-green-700 to-green-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="text-4xl font-extrabold mb-8"
          >
            Contact Us
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="text-lg italic mb-8"
          >
            "The greatest threat to our planet is the belief that someone else will save it." – Robert Swan
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ amount: 0.3 }}
            className="text-lg space-y-4"
          >
            <p><strong>📍 Address:</strong> 123 Green Street, Sustainability City, Earth</p>
            <p><strong>📞 Mobile:</strong> +91 98765 43210</p>
            <p><strong>📧 Email:</strong> contact@greenbytes.com</p>
            <div className="flex justify-center space-x-6 mt-6">
              <motion.a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-400 text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ amount: 0.3 }}
              >
                <FaInstagram />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-400 text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ amount: 0.3 }}
              >
                <FaLinkedin />
              </motion.a>
              <motion.a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ amount: 0.3 }}
              >
                <FaTwitter />
              </motion.a>
              <motion.a
                href="mailto:contact@greenbytes.com"
                className="text-green-400 hover:text-green-300 text-3xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ amount: 0.3 }}
              >
                <FaEnvelope />
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default Home;