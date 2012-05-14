Reader::Application.routes.draw do
  root :to=>"pages#backbone"

  resources :users do
    post "genreset",      :to=>"users#gen_reset",  :as=>"genreset", :on=>:collection
    put "reset/:token",  :to=>"users#reset_post", :as=>"reset",    :on=>:member
  end
  resources :subscriptions, :only=>[:create, :destroy]
  resources :forums do
    get "users"
    post "invite"
    put "mark_all_read"
    resources :posts do
      member do
        put "set_marker"
      end
      resources :comments
    end
  end

  #non resourceful helpers
  post "/signin",     :to=>"sessions#create"
  match "/signout",   :to=>"sessions#destroy"

  get "/postframe",   :to=>"pages#postframe"
  get "/bbcv",        :to=>"pages#bbcv"
  get "/bookmarklet", :to=>"pages#bookmarklet"
  #get "/post/:sid",         :as=>:post,             :to=>"forums#post"
  #google reader style
  #get "/createpost/:sid",  :as=>"post_create_get", :to=>"posts#create"


  #admin
  get   "/adminsettings",   :to => "global_settings#edit"
  post  "/adminsettings",   :to => "global_settings#update"

  get "/test", :to=> "pages#test"

end
