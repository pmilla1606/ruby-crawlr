class HomeController < ApplicationController
  def show
    render :file => 'public/dist/index.html'
  end
end
