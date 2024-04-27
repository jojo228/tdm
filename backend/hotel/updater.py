from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger

from .petty_cash import update_petty, create_petty
from inventory.check_expiry import expiry_checker

job_defaults = {
    'coalesce': True,
    'max_instances': 1
}

def start():
    scheduler = BackgroundScheduler(job_defaults=job_defaults)
    # Create an entry for the petty Cash everyday at 00:01:00  
    scheduler.add_job(create_petty, CronTrigger.from_crontab('14 9 * * *'), timezone='Asia/Kolkata')

    # Update today's petty cash at 23:59:00 
    scheduler.add_job(update_petty, CronTrigger.from_crontab('38 11 * * *'), timezone='Asia/Kolkata')
        
    # Product expiry date job everyday at 23:59:00
    scheduler.add_job(expiry_checker, CronTrigger.from_crontab('51 11 * * *'), timezone='Asia/Kolkata')
    
    # # Create an entry for the petty Cash everyday at 20:45:00  
    # scheduler.add_job(create_petty, CronTrigger.from_crontab('45 20 * * *'), timezone='Asia/Kolkata')
    # # Update today's petty cash at 20:50:00 
    # scheduler.add_job(update_petty, CronTrigger.from_crontab('50 20 * * *'), timezone='Asia/Kolkata')

    scheduler.start()