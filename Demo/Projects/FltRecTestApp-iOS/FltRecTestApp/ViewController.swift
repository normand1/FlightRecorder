//
//  ViewController.swift
//  FltRecTestApp
//
//  Created by David Norman on 7/3/18.
//  Copyright © 2018 David Norman. All rights reserved.
//

import UIKit
import Alamofire

class ViewController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        
        Alamofire.request("https://jsonplaceholder.typicode.com/posts/1").responseJSON { response in
            
            if let json = response.result.value {
                print("JSON: \(json)")
                print("Headers: \( print(response.response?.allHeaderFields))")
            }
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

