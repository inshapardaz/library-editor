import { Box } from "@mantine/core";
import { Carousel } from '@mantine/carousel';
//------------------------------
const SuggestedBooks = () => {
    return (<Box>
        <Carousel
            withIndicators
            height={200}
            slideSize="33.333333%"
            slideGap="md"
            loop
            align="start"
            slidesToScroll={3}
        >
            <Carousel.Slide>1</Carousel.Slide>
            <Carousel.Slide>2</Carousel.Slide>
            <Carousel.Slide>3</Carousel.Slide>
            {/* ...other slides */}
        </Carousel>
    </Box>)
}

export default SuggestedBooks;