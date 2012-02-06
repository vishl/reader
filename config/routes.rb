Reader::Application.routes.draw do
  root :to=>"pages#home"

  ##api
  #bookmarklet
  get "/bookmarklet",                                  :to=>"pages#bookmarklet"
  get "/post/:sid",            :as=>:post,             :to=>"forums#post"
  #google reader style
  get "/createpost/:sid",      :as=>"post_create_get", :to=>"posts#create"
  #ajax request to see if we should update
  get "/latest/:sid",                                  :to=>"forums#latest"

  get "/postframe/:sid/:id",   :as=>:postframe,        :to=>"forums#postframe"
  get "/commentview/:sid/:id", :as=>:commentview,      :to=>"forums#commentview"

  post "/forums/spawn",        :as=>:spawn,            :to=>"forums#spawn"
  get  "/:sid",                :as=>:forum,            :to=>"forums#show"
  post "/:sid",                :as=>"post_create",     :to=>"posts#create"
  post "/:sid/:id",            :as=>"comment_create",  :to=>"comments#create"

end
