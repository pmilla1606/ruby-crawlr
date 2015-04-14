class RoutesController < ApplicationController

  def show 
    a = {a: 123, b: 456}

    render json: a
  end

end
