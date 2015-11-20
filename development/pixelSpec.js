
describe('pixelScreen', function() {


  it('should return an array', function() {
    var returnVal = pixelScreen(25);
    expect(Array.isArray(returnVal)).toBe(true);
  });

  it('should return a legal multiple (width and height) of the pixels', function() {
    var passedVal = 25;
    var returnVal = pixelScreen(passedVal);
    expect(returnVal[1][0] * returnVal[1][1]).toEqual(passedVal)
  });

  it('should return the smallest distance multiple (e.g 20 * 25 for 500)', function() {
    var returnVal = pixelScreen(500);
    expect(returnVal[1][0] === 20 && returnVal[1][1] === 25).toBe(true);
  });

  it('shoud higher a prime number to the next non prime number', function() {
    var returnVal = pixelScreen(19);
    expect(returnVal[2]).toEqual(20);
  });

  it('should show correct coordinates for 4 pixels', function(){
    var wanted = [ [ [ .5, 1.5 ], [ 1.5, 1.5 ] ],  
                   [ [ .5,  .5 ], [ 1.5 , .5 ] ] 
                  ];
    expect(pixelScreen(4)[0]).toEqual(wanted);

  })

  it('should show for 4 pixels instead of 3 to make it a non prime number', function(){
    var wanted = [ [ [ .5, 1.5 ], [ 1.5, 1.5 ] ],  
                   [ [ .5,  .5 ], [ 1.5 , .5 ] ] 
                 ];
    expect(pixelScreen(3)[0]).toEqual(wanted);
  });

  it('should show correct coordinates for 25 pixels', function(){


    var wanted = [ [ [ .5, 4.5 ], [ 1.5 ,4.5 ], [ 2.5,4.5 ], [ 3.5,4.5 ], [ 4.5,4.5 ] ],
                   [ [ .5, 3.5 ], [ 1.5 ,3.5 ], [ 2.5,3.5 ], [ 3.5,3.5 ], [ 4.5,3.5 ] ],
                   [ [ .5, 2.5 ], [ 1.5 ,2.5 ], [ 2.5,2.5 ], [ 3.5,2.5 ], [ 4.5,2.5 ] ],
                   [ [ .5, 1.5 ], [ 1.5 ,1.5 ], [ 2.5,1.5 ], [ 3.5,1.5 ], [ 4.5,1.5 ] ],
                   [ [ .5,  .5 ], [ 1.5 , .5 ], [ 2.5, .5 ], [ 3.5, .5 ], [ 4.5, .5 ] ] 
                 ];


    expect(pixelScreen(25)[0]).toEqual(wanted);
  })

  it('should show correct coordinates for 30 pixels', function() {

    var wanted = [ [ [ .5, 4.5 ], [ 1.5 ,4.5 ], [ 2.5,4.5 ], [ 3.5,4.5 ], [ 4.5,4.5 ], [ 5.5, 4.5 ] ],
                   [ [ .5, 3.5 ], [ 1.5 ,3.5 ], [ 2.5,3.5 ], [ 3.5,3.5 ], [ 4.5,3.5 ], [ 5.5, 3.5 ] ],
                   [ [ .5, 2.5 ], [ 1.5 ,2.5 ], [ 2.5,2.5 ], [ 3.5,2.5 ], [ 4.5,2.5 ], [ 5.5, 2.5 ] ],
                   [ [ .5, 1.5 ], [ 1.5 ,1.5 ], [ 2.5,1.5 ], [ 3.5,1.5 ], [ 4.5,1.5 ], [ 5.5, 1.5 ] ],
                   [ [ .5,  .5 ], [ 1.5 , .5 ], [ 2.5, .5 ], [ 3.5, .5 ], [ 4.5, .5 ], [ 5.5, .5 ] ] 
                 ];


    expect(pixelScreen(30)[0]).toEqual(wanted);
  });
  console.log(pixelScreen(11)[0])
  console.log(pixelScreen(11)[1])
  console.log(pixelScreen(11)[2])
});
