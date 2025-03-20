import { createContext, useContext, useState, useEffect } from 'react';
import { getCart, getFavs, removeFromCart } from '../helpers/ServerUsers';
import { getToken, setToken, removeToken, decodeToken } from '../helpers/Token.helper';
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiry, setTokenExpiry] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [updateMark, setUpdateMark] = useState();
  const [booleanUpdateMark, setBooleanUpdateMark] = useState(false);
  const [cantidades, setCantidades] = useState({});

  const checkToken = async () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken = decodeToken(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp >= currentTime) {
          setUser(decodedToken);
          setTokenExpiry(decodedToken.exp);

          const cartData = await getCart();
          const favsData = await getFavs();
          setCarrito(cartData.productos || []);
          setFavoritos(favsData.productos || []);

          const timeToExpire = (decodedToken.exp - currentTime) * 1000;
          setTimeout(checkToken, timeToExpire);

        } else {
          removeToken();
          setUser(null);
        }
      } catch (error) {
        console.error("Error al decodificar el token:", error);
        removeToken();
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkToken();
  }, []);

  const updateCartQuantities = (productos = []) => {
    setCantidades((prevCantidades) => {
      const nuevasCantidades = { ...prevCantidades };

      if (productos.length === 0) {
        return {};
      }

      productos.forEach((prod) => {
        if (!(prod._id in nuevasCantidades)) {
          nuevasCantidades[prod._id] = 1;
        }
      });

      return nuevasCantidades;
    });
  };

  const handleCantidadChange = (id, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({ ...prevCantidades, [id]: parseInt(nuevaCantidad) }));
  };

  useEffect(() => {
    const fetchCartAndFavs = async () => {
      try {
        if (updateMark === 'cart') {
          const cartData = await getCart();
          setCarrito(cartData?.productos || []);
          updateCartQuantities(cartData?.productos || []);
        }

        if (updateMark === 'fav') {
          const favsData = await getFavs();
          setFavoritos(favsData?.productos || []);
        }
      } catch (error) {
        console.error('Error al obtener carrito o favoritos:', error);
      }
    };

    fetchCartAndFavs();
  }, [updateMark, booleanUpdateMark]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setFirebaseUser(currentUser);
      if (currentUser) {
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginContext = async (token) => {
    try {
      const decodedToken = decodeToken(token);

      if (!decodedToken) {
        throw new Error("Token inválido o no se pudo decodificar");
      }

      const { email, sub, ...otherUserData } = decodedToken;
      const user = {
        uid: sub,
        email,
        ...otherUserData,
      };

      setUser(user);
      setToken(token);

      await clearCart();

      checkToken();
    } catch (error) {
      console.error("Error al iniciar sesión en loginContext:", error);
    }
  };

  const clearCart = async () => {
    try {
      const cartData = await getCart();
      if (cartData.productos.length > 0) {
        for (const singleCart of cartData.productos) {
          await removeFromCart(singleCart._id);
        }
      }
      setCarrito([]);
      setCantidades({});
      setUpdateMark('cart');
      setBooleanUpdateMark(prev => !prev);
    } catch (error) {
      console.error("Error al limpiar el carrito:", error);
    }
  };

  const logoutContext = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setTokenExpiry(null);
      await clearCart();
      setCarrito([]);
      setFavoritos([]);
      setCantidades({});
      removeToken();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loginContext,
      logoutContext,
      loading,
      carrito,
      setCarrito,
      favoritos,
      setFavoritos,
      setUpdateMark,
      setBooleanUpdateMark,
      clearCart,
      cantidades,
      setCantidades,
      handleCantidadChange
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
