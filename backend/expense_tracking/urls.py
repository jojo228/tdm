from django.urls import path
from . import views

urlpatterns = [
    # Create or Get all the expense products for a particular hotel
    path('expense_purchase_products/', views.expense_purchase_products, name='expense-products'),
    
    # Retrieve, Update or Delete a single product
    path('expense_purchase_product/<int:pk>/', views.retrieve_update_delete_expense_purchase, name='rud_expense_product'),
    
    # Create or Get all the expense products for a particular hotel
    path('expense_reselling_products/', views.expense_reselling_products, name='expense-products'),
    
    # Retrieve, Update or Delete a single product
    path('expense_reselling_product/<int:pk>/', views.retrieve_update_delete_expense_reselling, name='rud_expense_product'),
    
    # Create or Get all the salaries for a particular hotel 
    path('salary/', views.salary, name='salary'),
    
    # Retrieve, Update or Delete a single salary
    path('salary/<int:pk>/', views.retrieve_update_delete_salary, name='rud_salary'),
    
    # Create or Get all the rents for a particular hotel 
    path('rent/', views.rent, name='rent'),
    
    # Retrieve, Update or Delete a single rent
    path('rent/<int:pk>/', views.retrieve_update_delete_rent, name='rud_ebill'),
    
    # Create or Get all the expense products for a particular hotel 
    path('ebill/', views.ebill, name='ebill'),
    
    # Retrieve, Update or Delete a single product
    path('ebill/<int:pk>/', views.retrieve_update_delete_ebill, name='rud_ebill'),
    
    # Expense Dashbord for each month
    path('expense_dashboard/', views.expense_dashboard, name="expense-dashboard"),
    
    # Outlets Expense Dashbord for each month
    path('outlets_expense_dashboard/', views.outlets_expense_dashboard, name="outlets-expense-dashboard"),
    
]


