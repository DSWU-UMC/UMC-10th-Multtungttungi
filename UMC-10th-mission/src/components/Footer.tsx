import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="p-4 text-center text-xs text-gray-600">
      © {new Date().getFullYear()} 돌려돌려LP판.
      <div className={"flex justify-center space-x-4 mt-4"}>
        <Link to={"#"}>Privacy Policy</Link>
        <Link to={"#"}>Terms of Service</Link>
        <Link to={"#"}>Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;
