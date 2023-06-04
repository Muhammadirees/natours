import axios from 'axios'
import { showAlert } from './alerts'

const stripe = Stripe('pk_test_51NCFQCHuI9mlUuCpq7kF0TlwL0alXXeqRdJlPCrNUpHZi50nvmudyRIY7kGPmZEIfebIS08Bxc8nNFEr7Guu8wXZ00bIWz30Nv')

export const bookTour = async tourId => {
   try {
      // 1) Get checkout session from API
      const session = await axios({ url: `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}` })
      console.log(session)

      // 2) Create checkout form + charge credit card
      await stripe.redirectToCheckout({
         sessionId: session.data.session.id
      })

   } catch (err) {
      console.log(err)
      showAlert('error', err)
   }

}