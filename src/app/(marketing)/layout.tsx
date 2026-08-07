import Footer from "../components/landingpage/Footer";
import Header from "../components/landingpage/Header";


export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}