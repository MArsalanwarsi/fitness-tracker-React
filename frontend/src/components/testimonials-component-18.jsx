import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

const TestimonialsComponent = ({ testimonials }) => {
  return (
    <section className='py-8 sm:py-16 lg:py-24'>
      <Carousel
        className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-11 px-4 sm:px-6 md:grid-cols-2 lg:px-8'
        opts={{
          align: 'start',
          slidesToScroll: 1
        }}
      >
        {/* Left Content */}
        <div className='space-y-4 md:space-y-16'>
          <div className='space-y-4'>
            {/* <Badge variant='outline' className='text-sm font-normal'>
              Testimonials
            </Badge> */}

            <h2 className='text-2xl font-urbanist font-semibold sm:text-3xl lg:text-4xl'>
              Real People. Real Progress.
            </h2>

            <p className='text-muted-foreground font-urbanist text-xl text-white'>
              See how our community turns consistency into real, measurable results.
            </p>
          </div>

          <div className='flex items-center gap-5'>
            <CarouselPrevious
              variant='default'
              className='bg-white text-primary hover:bg-white/80 disabled:bg-primary disabled:text-white static size-9 translate-y-0 disabled:opacity-100'
            />
            <CarouselNext
              variant='default'
              className='bg-white text-primary hover:bg-white/80 disabled:bg-primary disabled:text-white static size-9 translate-y-0 disabled:opacity-100'
            />
          </div>
        </div>

        {/* Right Testimonial Carousel */}
        <div className='relative'>
          <CarouselContent className='sm:-ml-6'>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className='sm:pl-6'>
                <div className='flex flex-col gap-10'>
                  <div className='space-y-2'>
                    <p className='h-14 text-8xl'>&ldquo;</p>
                    <p className='text-white text-xl font-medium sm:text-2xl lg:text-3xl'>
                      {testimonial.content}
                    </p>
                  </div>

                  <div className='flex items-center gap-2'>
                    <Avatar className='size-12 rounded-full'>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback className='rounded-full text-sm'>
                        {testimonial.name
                          .split(' ')
                          .slice(0, 2)
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className='flex-1'>
                      <h4 className='text-lg font-medium'>{testimonial.name}</h4>
                      <p className='text-muted-foreground text-white'>
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </div>
      </Carousel>
    </section>
  )
}

export default TestimonialsComponent
