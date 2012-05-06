/*
Copyright 2012 Vishal Parikh                                             
This file is part of Freader.                                            
Freader is free software: you can redistribute it and/or modify          
it under the terms of the GNU General Public License as published by     
the Free Software Foundation, either version 3 of the License, or        
(at your option) any later version.                                      
                                                                         
Freader is distributed in the hope that it will be useful,               
but WITHOUT ANY WARRANTY; without even the implied warranty of           
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the            
GNU General Public License for more details.                             
                                                                         
You should have received a copy of the GNU General Public License        
along with Freader.  If not, see <http://www.gnu.org/licenses/>.         
*/
/*global GlobalSettings */
function handleErrors(message, url, line){
  if(GlobalSettings && GlobalSettings.deployment==="development"){
  }else{
    alert("Something has gone wrong, you probably need to reload the page\n\n({0},line {1}){2}".format(url, line, message));
  }
}
//window.onerror = handleErrors;
