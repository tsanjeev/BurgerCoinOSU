from google.appengine.ext import ndb
import webapp2
import json
import time
import datetime
from datetime import datetime
from datetime import time
		
#######################
## Email Address class
#######################
		
class EmailAddress(ndb.Model):
	address = ndb.StringProperty()
	passcode = ndb.StringProperty()
	existence = ndb.StringProperty()

#######################
## Email Address handler
#######################	
	
class EmailAddressHandler(webapp2.RequestHandler):
	def post(self):
		self.response.headers.add_header("Access-Control-Allow-Origin", "https://burgercoin-project-2018.herokuapp.com/u_signup")
		new_address_data = json.loads(self.request.body)
		new_address = new_address_data['address']
		new_passcode = new_address_data['passcode']
		new_existence = 'unverified'
		
		# first, get all the current email addresses
		address_query = EmailAddress.query()
		
		# search all current addresses 
		found = 0
		for address_entity in address_query:
			address_dict = address_entity.to_dict()
			current_address = address_dict['address']
			current_passcode = address_dict['passcode']
			current_existence = address_dict['existence']
			if (current_address == new_address):
				if (current_existence == 'received'):
					found = 1
				if (current_existence == 'unverified'):
					if (current_passcode == new_passcode):
						address_entity.existence = 'received'
						address_entity.put()
						found = -1
                                        if (current_passcode != new_passcode):
                                                found = 2
					
                # if the passcode is wrong
                if (found == 2):
                        self.response.write('wrongcode')

		# if the address is found
                if (found == 1):
			self.response.write('exists')
			
		# if the row is created
		if (found == -1):
			self.response.write('verified')
			
		# if the address isn't found
		if (found == 0):
			new_account = EmailAddress(address=new_address)
			new_account.put()
			new_account.passcode = new_passcode
			new_account.put()
			new_account.existence = 'unverified'
			new_account.put()
			self.response.write('created')

	def delete(self, id=None):
		#c = ndb.Key(urlsafe=id).get()
		#c.key.delete()
		self.response.write("*in delete handler*")
		remove_address = self.request.get('address')
		all_addresses = EmailAddress.query()
		for address_entity in all_addresses:
			address_dict = address_entity.to_dict()
			if address_dict['address'] == remove_address:
				self.response.write(remove_address)
				self.response.write("\n")
				self.response.write(address_entity)
				self.response.write("\n")
				address_key = address_entity.key
				self.response.write(address_key)
				#address_id_dict = address_key.to_dict()
				#self.response.write(address_id_dict)
				#b = ndb.Key(urlsafe=id).get()
				address_key.delete()
				self.response.write("deleted")
				
	def get(self, id=None):
            self.response.headers.add_header("Access-Control-Allow-Origin", "https://burgercoin-project-2018.herokuapp.com")
	    address_query = EmailAddress.query()
	    return_object = []
	    for address_entity in address_query:
	        address_dict = address_entity.to_dict()
		return_object.append(address_dict)
            self.response.write(json.dumps(return_object))

###############################
## Main Page Handler and class
###############################	
			
class MainPage(webapp2.RequestHandler):

    def get(self):
		self.response.write("Hello.")
		self.response.write("\n")
		self.response.write("No action performed by the main page handler.")

allowed_methods = webapp2.WSGIApplication.allowed_methods
new_allowed_methods = allowed_methods.union(('PATCH',))
webapp2.WSGIApplication.allowed_methods = new_allowed_methods
		
app = webapp2.WSGIApplication([
    ('/', MainPage),
	('/account', EmailAddressHandler)
], debug=True)
