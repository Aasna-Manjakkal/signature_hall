import PageHeader from "../components/PageHeader"
import Gallery from "../components/Gallery"

function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Moments that Matter"
        image="/gallery/covered-2.jpg"
        crumb="Gallery"
      />
      <Gallery showHeading={false} large />
    </>
  )
}

export default GalleryPage