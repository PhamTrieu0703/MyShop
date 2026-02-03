import Header from "../components/Header/Header"
import Footer from "../components/Footer/footer";
import "./MainLayout.css";
function MainLayout({ children }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer/>
    </div>
  );
}
export default MainLayout
