#-----------------------------------------------------------------------#
#                   Django CRON class to schedule a task                #
#-----------------------------------------------------------------------#
# from django_cron import CronJobBase, Schedule
from hotel.models import HotelData, PettyCash
from sales.models import PaymentCategory, Bill
from datetime import datetime as date


def create_petty():
    hotels = HotelData.objects.all()
    print(hotels)
    # if "16:42" in date.today().time().strftime("%H:%M:%S"):
    for hotel in hotels:
        print('Create Petty Cash at', date.now(), 'for a hotel', hotel)
        last_closing = PettyCash.objects.filter(hotel=hotel.hotel_id).last()
        if last_closing is None:
            PettyCash.objects.create(hotel = hotel)
            
        else:
            last_closing = PettyCash.objects.filter(hotel=hotel.hotel_id).last().closing_balance
            PettyCash.objects.create(hotel = hotel)
            PettyCash.objects.filter(hotel = hotel).update(initial_balance = last_closing)
        
def update_petty():
    hotels = HotelData.objects.all()
    # if "17:43" in  date.today().time().strftime("%H:%M:%S"):
    for hotel in hotels:
        print('Update Petty Cash at', date.now(), 'for a hotel', hotel)
        # last_closing = PettyCash.objects.filter(hotel=hotel.hotel_id).last().closing_balance
    # Check if it is the first time the are using the pettycash
        if PaymentCategory.objects.filter(hotel=hotel.hotel_id, name='cash').exists():
            pay_type_id = PaymentCategory.objects.get(hotel=hotel.hotel_id, name='cash').id
            bills = Bill.objects.filter(
                hotel_id=hotel.hotel_id, 
                bill_status='paid',
                created_at__startswith=date.today().strftime("%Y-%m-%d"),
                payment_type = pay_type_id
            )
            
            today_petty = PettyCash.objects.filter(
                hotel=hotel.hotel_id, 
                date__startswith=date.today().strftime("%Y-%m-%d")
            )
            closing = today_petty.last().initial_balance + today_petty.last().opening_amount + sum([sold.net_amount for sold in bills]) - today_petty.last().outgoing_amount
            today_petty.update(closing_balance=closing, incoming_amount=sum([sold.net_amount for sold in bills]))
